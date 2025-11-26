import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { generateAccessToken } from '../services/tokenService.js'

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
  const user = await User.findById(req.user.id).select('-passwordHash')
  return res.status(StatusCodes.OK).json(success(user))
})


