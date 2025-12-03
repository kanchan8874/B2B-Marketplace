import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'
import { OTP } from '../models/OTP.js'
import { ApiError } from '../utils/ApiError.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { generateAccessToken } from '../services/tokenService.js'
import { env } from '../config/env.js'
import { sendEmail } from '../services/emailService.js'

export const authValidation = {
  signup: Joi.object({
    body: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('buyer', 'seller').required(),
      companyName: Joi.string().allow('', null),
      location: Joi.object({
        city: Joi.string().allow('', null),
        state: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
      }).optional(),
    }).required(),
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).required(),
  }),
  sendOtp: Joi.object({
    body: Joi.object({
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
    })
      .or('email', 'phone')
      .required(),
  }),
  verifyOtp: Joi.object({
    body: Joi.object({
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      otp: Joi.string().length(6).required(),
    })
      .or('email', 'phone')
      .required(),
  }),
  adminLogin: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).required(),
  }),
}

export const signup = catchAsync(async (req, res) => {
  const { name, email, password, role, companyName, location } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email is already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    companyName,
    location,
  })

  const token = generateAccessToken(user)

  return res
    .status(StatusCodes.CREATED)
    .json(success({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Signup successful'))
})

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  }

  const ok = await bcrypt.compare(password, user.passwordHash)

  if (!ok) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  }

  const token = generateAccessToken(user)

  return res.status(StatusCodes.OK).json(
    success(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful',
    ),
  )
})

export const me = catchAsync(async (req, res) => {
  // Static admin user is not stored in DB
  if (req.user.role === 'admin' && req.user.id === 'admin') {
    return res.status(StatusCodes.OK).json(success(req.user))
  }

  const user = await User.findById(req.user.id).select('-passwordHash')
  return res.status(StatusCodes.OK).json(success(user))
})

/**
 * Admin login with static credentials from env
 */
export const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
  }

  // Static admin "user" payload for token + frontend
  const adminUser = {
    id: 'admin',
    name: 'Admin',
    email: env.ADMIN_EMAIL,
    role: 'admin',
  }

  const token = generateAccessToken(adminUser)

  return res.status(StatusCodes.OK).json(
    success(
      {
        token,
        user: adminUser,
      },
      'Login successful',
    ),
  )
})

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to email or phone
 */
export const sendOtp = catchAsync(async (req, res) => {
  const { email, phone } = req.body

  if (!email && !phone) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email or phone is required')
  }

  const type = email ? 'email' : 'phone'
  const identifier = email || phone

  // Check if user exists (case-insensitive email search)
  const user = email
    ? await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
    : await User.findOne({ phone })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found with this email/phone')
  }

  // Generate OTP
  const otpCode = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  
  // Log OTP in console for testing (since emails are not being delivered)
  console.log(`🔑 OTP for ${identifier}: ${otpCode}`)

  // Delete any existing unverified OTPs for this identifier (case-insensitive for email)
  const deleteQuery = { verified: false }
  if (type === 'email') {
    deleteQuery.email = { $regex: new RegExp(`^${identifier}$`, 'i') }
  } else {
    deleteQuery.phone = identifier
  }
  await OTP.deleteMany(deleteQuery)

  // Create new OTP (store email in lowercase for consistency)
  const otpData = {
    otp: otpCode,
    type,
    expiresAt,
    verified: false,
    attempts: 0,
  }
  if (type === 'email') {
    otpData.email = identifier.toLowerCase()
  } else {
    otpData.phone = identifier
  }
  await OTP.create(otpData)

  // Send OTP via email (phone SMS would require SMS service)
  if (type === 'email') {
    try {
      await sendEmail({
        to: email,
        subject: 'Your OTP for Login',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0F62FE;">Your Login OTP</h2>
            <p>Hello ${user.name},</p>
            <p>Your one-time password (OTP) for login is:</p>
            <div style="background-color: #f4f7fa; border: 2px solid #0F62FE; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #0F62FE; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>B2B Marketplace Team</p>
          </div>
        `,
        text: `Your OTP for login is: ${otpCode}. This OTP will expire in 5 minutes.`,
      })
      console.log(`[sendOtp] OTP email sent successfully to ${email}`)
    } catch (error) {
      console.error('[sendOtp] Failed to send OTP email:', {
        email,
        error: error.message,
        code: error.code,
        response: error.response,
      })
      // Don't throw error, OTP is still created - user can request again
    }
  }

  return res.status(StatusCodes.OK).json(
    success(
      {
        message: type === 'email' ? 'OTP sent to your email' : 'OTP sent to your phone',
        expiresIn: 300, // 5 minutes in seconds
      },
      'OTP sent successfully',
    ),
  )
})

/**
 * Verify OTP and login
 */
export const verifyOtp = catchAsync(async (req, res) => {
  const { email, phone, otp } = req.body

  if (!email && !phone) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email or phone is required')
  }

  const type = email ? 'email' : 'phone'
  const identifier = email || phone

  // Find the OTP (case-insensitive email search)
  const otpQuery = {
    otp,
    verified: false,
    expiresAt: { $gt: new Date() }, // Not expired
  }
  if (type === 'email') {
    otpQuery.email = { $regex: new RegExp(`^${identifier}$`, 'i') }
  } else {
    otpQuery.phone = identifier
  }
  const otpRecord = await OTP.findOne(otpQuery)

  if (!otpRecord) {
    // Increment attempts for rate limiting (case-insensitive for email)
    const updateQuery = { verified: false }
    if (type === 'email') {
      updateQuery.email = { $regex: new RegExp(`^${identifier}$`, 'i') }
    } else {
      updateQuery.phone = identifier
    }
    await OTP.updateOne(updateQuery, { $inc: { attempts: 1 } })

    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired OTP')
  }

  // Mark OTP as verified
  otpRecord.verified = true
  await otpRecord.save()

  // Find user (case-insensitive email search)
  const user = email
    ? await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
    : await User.findOne({ phone })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  // Generate token
  const token = generateAccessToken(user)

  // Delete all OTPs for this identifier (case-insensitive for email)
  const deleteQuery = {}
  if (type === 'email') {
    deleteQuery.email = { $regex: new RegExp(`^${identifier}$`, 'i') }
  } else {
    deleteQuery.phone = identifier
  }
  await OTP.deleteMany(deleteQuery)

  return res.status(StatusCodes.OK).json(
    success(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'OTP verified successfully',
    ),
  )
})


