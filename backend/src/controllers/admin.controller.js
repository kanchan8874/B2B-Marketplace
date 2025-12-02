import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { RFQ } from '../models/RFQ.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { sendProductModerationEmail, shouldSendEmailForUser } from '../services/emailService.js'

export const adminValidation = {
  updateUserStatus: Joi.object({
    body: Joi.object({
      isActive: Joi.boolean().required(),
    }).required(),
  }),
  moderateProduct: Joi.object({
    body: Joi.object({
      status: Joi.string().valid('Pending', 'Live', 'Draft').required(),
    }).required(),
  }),
  updateUserApproval: Joi.object({
    body: Joi.object({
      isApproved: Joi.boolean().required(),
    }).required(),
  }),
}

export const listUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-passwordHash')
  return res.status(StatusCodes.OK).json(success(users))
})

export const updateUserStatus = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select(
    '-passwordHash',
  )
  return res.status(StatusCodes.OK).json(success(user, 'User status updated'))
})

export const updateUserApproval = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved },
    { new: true },
  ).select('-passwordHash')
  return res.status(StatusCodes.OK).json(success(user, 'User approval updated'))
})

export const listPendingProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ status: 'Pending' }).populate('seller category', 'name')
  return res.status(StatusCodes.OK).json(success(products))
})

export const moderateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  ).populate('seller', 'name email')

  // Fire-and-forget email to seller about moderation result
  if (product?.seller?.email && shouldSendEmailForUser(product.seller, 'product')) {
    try {
      await sendProductModerationEmail({
        to: product.seller.email,
        sellerName: product.seller.name,
        productName: product.name,
        status: product.status,
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[email] Failed to send product moderation email', error)
      }
    }
  }

  return res.status(StatusCodes.OK).json(success(product, 'Product updated'))
})

export const listRFQsForAdmin = catchAsync(async (req, res) => {
  const rfqs = await RFQ.find().sort('-createdAt')
  return res.status(StatusCodes.OK).json(success(rfqs))
})


