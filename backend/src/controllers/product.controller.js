import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { ApiError } from '../utils/ApiError.js'
import { getProductLimit, canAddProduct, getRemainingSlots, getTierConfig } from '../config/subscriptionTiers.js'
import { isPriceValidityExpired } from '../services/priceValidityService.js'

export const productValidation = {
  upsert: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      shortDescription: Joi.string().allow('', null),
      description: Joi.string().allow('', null),
      category: Joi.string().required(),
      priceMin: Joi.number().required(),
      priceMax: Joi.number().required(),
      moq: Joi.number().required(),
      tags: Joi.array().items(Joi.string()).optional(),
      city: Joi.string().allow('', null),
      state: Joi.string().allow('', null),
      status: Joi.string().valid('Draft', 'Pending', 'Live', 'To Be Offered').optional(),
      priceValidityDate: Joi.date().optional(),
      paymentTerms: Joi.string().valid('Net 15', 'Net 30', 'Net 45', 'Net 60', 'Advance', 'COD', 'Other').optional(),
      shipmentMode: Joi.string().valid('Road', 'Rail', 'Air', 'Sea', 'Express', 'Other').optional(),
    }).required(),
  }),
}

export const listProducts = catchAsync(async (req, res) => {
  const { category, search, seller } = req.query

  const filter = {}
  if (category) filter.category = category
  if (seller) filter.seller = seller
  if (search) {
    filter.name = { $regex: search, $options: 'i' }
  }

  const products = await Product.find(filter).populate('category seller', 'name')
  
  // Check and update expired price validity for each product
  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      if (product.status === 'Live' && isPriceValidityExpired(product)) {
        product.status = 'To Be Offered'
        await product.save()
      }
      return product
    })
  )

  return res.status(StatusCodes.OK).json(success(updatedProducts))
})

export const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category seller', 'name')
  
  // Check and update expired price validity
  if (product && product.status === 'Live' && isPriceValidityExpired(product)) {
    product.status = 'To Be Offered'
    await product.save()
  }
  
  return res.status(StatusCodes.OK).json(success(product))
})

export const createProduct = catchAsync(async (req, res) => {
  // Check subscription tier limit
  if (req.user.role === 'seller') {
    const seller = await User.findById(req.user.id)
    if (!seller) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Seller not found')
    }

    // Count current live/pending products (excluding drafts)
    const currentProductCount = await Product.countDocuments({
      seller: req.user.id,
      status: { $in: ['Live', 'Pending'] },
    })

    // Check if seller can add more products
    if (!canAddProduct(currentProductCount, seller.subscriptionTier)) {
      const tierConfig = getTierConfig(seller.subscriptionTier)
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        `Product limit reached. Your ${tierConfig.displayName} tier allows ${tierConfig.productLimit} products. Please upgrade your subscription to add more products.`,
      )
    }
  }

  const body = {
    ...req.body,
    seller: req.user.id,
  }

  if (req.file) {
    body.images = [req.file.path]
  }

  const product = await Product.create(body)
  return res.status(StatusCodes.CREATED).json(success(product, 'Product created'))
})

export const updateProduct = catchAsync(async (req, res) => {
  const update = { ...req.body }
  if (req.file) {
    update.$push = { images: req.file.path }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
  return res.status(StatusCodes.OK).json(success(product, 'Product updated'))
})


