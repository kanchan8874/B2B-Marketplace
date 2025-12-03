import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { SellerKYC } from '../models/SellerKYC.js'
import { BuyerKYC } from '../models/BuyerKYC.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { sendKYCStatusEmail, shouldSendEmailForUser } from '../services/emailService.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

// Seller KYC Validation
export const sellerKYCValidation = {
  submit: Joi.object({
    body: Joi.object({
      businessName: Joi.string().trim().required(),
      businessAddress: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      contactPerson: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      gstNumber: Joi.string().trim().allow('', null),
      yearsInBusiness: Joi.number().integer().min(0).required(),
      businessType: Joi.string().valid('manufacturer', 'trader', 'both').required(),
    }).required(),
  }),
  approve: Joi.object({
    params: Joi.object({
      kycId: Joi.string().required(),
    }).required(),
  }),
  reject: Joi.object({
    params: Joi.object({
      kycId: Joi.string().required(),
    }).required(),
    body: Joi.object({
      rejectionReason: Joi.string().trim().required(),
    }).required(),
  }),
}

// Buyer KYC Validation
export const buyerKYCValidation = {
  submit: Joi.object({
    body: Joi.object({
      businessName: Joi.string().trim().required(),
      contactPerson: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().trim().required(),
      gstNumber: Joi.string().trim().allow('', null),
      businessAddress: Joi.string().trim().allow('', null),
      city: Joi.string().trim().allow('', null),
      state: Joi.string().trim().allow('', null),
    }).required(),
  }),
  approve: Joi.object({
    params: Joi.object({
      kycId: Joi.string().required(),
    }).required(),
  }),
  reject: Joi.object({
    params: Joi.object({
      kycId: Joi.string().required(),
    }).required(),
    body: Joi.object({
      rejectionReason: Joi.string().trim().required(),
    }).required(),
  }),
}

// ========== SELLER KYC ==========

/**
 * Submit Seller KYC
 */
export const submitSellerKYC = catchAsync(async (req, res) => {
  const sellerId = req.user.id

  if (req.user.role !== 'seller') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only sellers can submit KYC')
  }

  // Check if KYC already exists
  const existingKYC = await SellerKYC.findOne({ seller: sellerId })
  if (existingKYC && existingKYC.status === 'Approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved')
  }

  const {
    businessName,
    businessAddress,
    city,
    state,
    contactPerson,
    phone,
    email,
    gstNumber,
    yearsInBusiness,
    businessType,
  } = req.body

  // Handle file uploads – upload to Cloudinary and remove local temp files
  const uploadDoc = async (file, folder) => {
    const resourceType = file.mimetype && file.mimetype.startsWith('image/') ? 'image' : 'raw'
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
      })
      return result.secure_url
    } finally {
      try {
        fs.unlinkSync(file.path)
      } catch {
        // ignore fs errors
      }
    }
  }

  const documents = {}
  if (req.files) {
    if (req.files.certificateOfIncorporation) {
      documents.certificateOfIncorporation = await uploadDoc(
        req.files.certificateOfIncorporation[0],
        'b2b-marketplace/kyc/seller',
      )
    }
    if (req.files.gstCertificate) {
      documents.gstCertificate = await uploadDoc(
        req.files.gstCertificate[0],
        'b2b-marketplace/kyc/seller',
      )
    }
    if (req.files.otherDocuments) {
      documents.otherDocuments = await Promise.all(
        req.files.otherDocuments.map((file) => uploadDoc(file, 'b2b-marketplace/kyc/seller')),
      )
    }
  }

  if (!documents.certificateOfIncorporation) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Certificate of Incorporation is required')
  }

  const kycData = {
    seller: sellerId,
    businessName,
    businessAddress,
    city,
    state,
    contactPerson,
    phone,
    email,
    gstNumber: gstNumber || undefined,
    yearsInBusiness,
    businessType,
    documents,
    status: 'Pending',
  }

  let kyc
  if (existingKYC) {
    // Update existing KYC
    kyc = await SellerKYC.findByIdAndUpdate(existingKYC._id, kycData, { new: true })
  } else {
    // Create new KYC
    kyc = await SellerKYC.create(kycData)
  }

  return res.status(StatusCodes.CREATED).json(success(kyc, 'KYC submitted successfully'))
})

/**
 * Get Seller KYC Status
 */
export const getSellerKYC = catchAsync(async (req, res) => {
  const sellerId = req.user.id

  if (req.user.role !== 'seller') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only sellers can view their KYC')
  }

  const kyc = await SellerKYC.findOne({ seller: sellerId }).populate('reviewedBy', 'name email')

  if (!kyc) {
    return res.status(StatusCodes.OK).json(success(null, 'No KYC submission found'))
  }

  return res.status(StatusCodes.OK).json(success(kyc))
})

/**
 * Admin: Get All Pending Seller KYCs
 */
export const getPendingSellerKYCs = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can view pending KYCs')
  }

  const { status = 'Pending', page = 1, limit = 10 } = req.query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const filter = status === 'All' ? {} : { status }

  const [kycs, total] = await Promise.all([
    SellerKYC.find(filter)
      .populate('seller', 'name email companyName')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    SellerKYC.countDocuments(filter),
  ])

  return res.status(StatusCodes.OK).json(
    success({
      kycs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }),
  )
})

/**
 * Admin: Approve Seller KYC
 */
export const approveSellerKYC = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can approve KYC')
  }

  const { kycId } = req.params

  const kyc = await SellerKYC.findById(kycId)
  if (!kyc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found')
  }

  if (kyc.status === 'Approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved')
  }

  kyc.status = 'Approved'
  kyc.reviewedBy = req.user.id
  kyc.reviewedAt = new Date()
  kyc.rejectionReason = undefined
  await kyc.save()

  // Update user's verification status
  const sellerUser = await User.findByIdAndUpdate(
    kyc.seller,
    { isVerified: true },
    { new: true },
  )

  // Email notification to seller (if enabled)
  try {
    if (shouldSendEmailForUser(sellerUser, 'kyc')) {
      await sendKYCStatusEmail({
        to: kyc.email,
        name: kyc.contactPerson,
        role: 'seller',
        status: 'Approved',
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send seller KYC approval email', error)
    }
  }

  return res.status(StatusCodes.OK).json(success(kyc, 'KYC approved successfully'))
})

/**
 * Admin: Reject Seller KYC
 */
export const rejectSellerKYC = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can reject KYC')
  }

  const { kycId } = req.params
  const { rejectionReason } = req.body

  const kyc = await SellerKYC.findById(kycId)
  if (!kyc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found')
  }

  kyc.status = 'Rejected'
  kyc.reviewedBy = req.user.id
  kyc.reviewedAt = new Date()
  kyc.rejectionReason = rejectionReason
  await kyc.save()

  // Update user's verification status
  const sellerUser = await User.findByIdAndUpdate(
    kyc.seller,
    { isVerified: false },
    { new: true },
  )

  // Email notification to seller (if enabled)
  try {
    if (shouldSendEmailForUser(sellerUser, 'kyc')) {
      await sendKYCStatusEmail({
        to: kyc.email,
        name: kyc.contactPerson,
        role: 'seller',
        status: 'Rejected',
        reason: rejectionReason,
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send seller KYC rejection email', error)
    }
  }

  return res.status(StatusCodes.OK).json(success(kyc, 'KYC rejected'))
})

// ========== BUYER KYC ==========

/**
 * Submit Buyer KYC
 */
export const submitBuyerKYC = catchAsync(async (req, res) => {
  const buyerId = req.user.id

  if (req.user.role !== 'buyer') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only buyers can submit KYC')
  }

  // Check if KYC already exists
  const existingKYC = await BuyerKYC.findOne({ buyer: buyerId })
  if (existingKYC && existingKYC.status === 'Approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved')
  }

  const {
    businessName,
    contactPerson,
    email,
    phone,
    gstNumber,
    businessAddress,
    city,
    state,
  } = req.body

  // Handle file uploads (optional for buyers) – upload to Cloudinary
  const uploadDoc = async (file, folder) => {
    const resourceType = file.mimetype && file.mimetype.startsWith('image/') ? 'image' : 'raw'
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
      })
      return result.secure_url
    } finally {
      try {
        fs.unlinkSync(file.path)
      } catch {
        // ignore fs errors
      }
    }
  }

  const documents = {}
  if (req.files) {
    if (req.files.businessRegistration) {
      documents.businessRegistration = await uploadDoc(
        req.files.businessRegistration[0],
        'b2b-marketplace/kyc/buyer',
      )
    }
    if (req.files.gstCertificate) {
      documents.gstCertificate = await uploadDoc(
        req.files.gstCertificate[0],
        'b2b-marketplace/kyc/buyer',
      )
    }
    if (req.files.otherDocuments) {
      documents.otherDocuments = await Promise.all(
        req.files.otherDocuments.map((file) => uploadDoc(file, 'b2b-marketplace/kyc/buyer')),
      )
    }
  }

  const kycData = {
    buyer: buyerId,
    businessName,
    contactPerson,
    email,
    phone,
    gstNumber: gstNumber || undefined,
    businessAddress: businessAddress || undefined,
    city: city || undefined,
    state: state || undefined,
    documents,
    status: 'Pending',
  }

  let kyc
  if (existingKYC) {
    kyc = await BuyerKYC.findByIdAndUpdate(existingKYC._id, kycData, { new: true })
  } else {
    kyc = await BuyerKYC.create(kycData)
  }

  return res.status(StatusCodes.CREATED).json(success(kyc, 'KYC submitted successfully'))
})

/**
 * Get Buyer KYC Status
 */
export const getBuyerKYC = catchAsync(async (req, res) => {
  const buyerId = req.user.id

  if (req.user.role !== 'buyer') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only buyers can view their KYC')
  }

  const kyc = await BuyerKYC.findOne({ buyer: buyerId }).populate('reviewedBy', 'name email')

  if (!kyc) {
    return res.status(StatusCodes.OK).json(success(null, 'No KYC submission found'))
  }

  return res.status(StatusCodes.OK).json(success(kyc))
})

/**
 * Admin: Get All Pending Buyer KYCs
 */
export const getPendingBuyerKYCs = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can view pending KYCs')
  }

  const { status = 'Pending', page = 1, limit = 10 } = req.query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const filter = status === 'All' ? {} : { status }

  const [kycs, total] = await Promise.all([
    BuyerKYC.find(filter)
      .populate('buyer', 'name email companyName')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    BuyerKYC.countDocuments(filter),
  ])

  return res.status(StatusCodes.OK).json(
    success({
      kycs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }),
  )
})

/**
 * Admin: Approve Buyer KYC
 */
export const approveBuyerKYC = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can approve KYC')
  }

  const { kycId } = req.params

  const kyc = await BuyerKYC.findById(kycId)
  if (!kyc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found')
  }

  if (kyc.status === 'Approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved')
  }

  kyc.status = 'Approved'
  kyc.reviewedBy = req.user.id
  kyc.reviewedAt = new Date()
  kyc.rejectionReason = undefined
  await kyc.save()

  // Update user's verification status
  const buyerUser = await User.findByIdAndUpdate(
    kyc.buyer,
    { isVerified: true },
    { new: true },
  )

  // Email notification to buyer (if enabled)
  try {
    if (shouldSendEmailForUser(buyerUser, 'kyc')) {
      await sendKYCStatusEmail({
        to: kyc.email,
        name: kyc.contactPerson,
        role: 'buyer',
        status: 'Approved',
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send buyer KYC approval email', error)
    }
  }

  return res.status(StatusCodes.OK).json(success(kyc, 'KYC approved successfully'))
})

/**
 * Admin: Reject Buyer KYC
 */
export const rejectBuyerKYC = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can reject KYC')
  }

  const { kycId } = req.params
  const { rejectionReason } = req.body

  const kyc = await BuyerKYC.findById(kycId)
  if (!kyc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found')
  }

  kyc.status = 'Rejected'
  kyc.reviewedBy = req.user.id
  kyc.reviewedAt = new Date()
  kyc.rejectionReason = rejectionReason
  await kyc.save()

  // Update user's verification status
  const buyerUser = await User.findByIdAndUpdate(
    kyc.buyer,
    { isVerified: false },
    { new: true },
  )

  // Email notification to buyer (if enabled)
  try {
    if (shouldSendEmailForUser(buyerUser, 'kyc')) {
      await sendKYCStatusEmail({
        to: kyc.email,
        name: kyc.contactPerson,
        role: 'buyer',
        status: 'Rejected',
        reason: rejectionReason,
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send buyer KYC rejection email', error)
    }
  }

  return res.status(StatusCodes.OK).json(success(kyc, 'KYC rejected'))
})

