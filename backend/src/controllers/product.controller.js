import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { ApiError } from '../utils/ApiError.js'
import { getProductLimit, canAddProduct, getRemainingSlots, getTierConfig } from '../config/subscriptionTiers.js'
import { isPriceValidityExpired } from '../services/priceValidityService.js'
import cloudinary from '../config/cloudinary.js'

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
  const { category, search, seller, status } = req.query

  const filter = {}
  if (category) filter.category = category
  if (seller) filter.seller = seller
  if (status && status !== 'All') filter.status = status
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
  // Only allow verified sellers (KYC approved) to create products
  if (req.user.role === 'seller') {
    const seller = await User.findById(req.user.id)
    if (!seller) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Seller not found')
    }

    if (!seller.isVerified) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Your KYC is not approved yet. Please complete seller verification before listing products.',
      )
    }

    // Check subscription tier limit
    const currentProductCount = await Product.countDocuments({
      seller: req.user.id,
      status: { $in: ['Live', 'Pending'] },
    })

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

  // Upload up to 4 images to Cloudinary if provided (optimised for web)
  if (Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = []
    for (const file of req.files) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'b2b-marketplace/products',
          resource_type: 'image',
          transformation: [
            {
              quality: 'auto:good',
              fetch_format: 'auto',
            },
          ],
        })
        imageUrls.push(uploadResult.secure_url)
      } catch (error) {
        console.error('[createProduct] Failed to upload image to Cloudinary:', {
          path: file.path,
          message: error.message,
        })
      } finally {
        try {
          fs.unlinkSync(file.path)
        } catch {
          // ignore fs errors
        }
      }
    }
    if (imageUrls.length) {
      body.images = imageUrls
    }
  }

  const product = await Product.create(body)
  return res.status(StatusCodes.CREATED).json(success(product, 'Product created'))
})

export const updateProduct = catchAsync(async (req, res) => {
  const update = { ...req.body }

  // If new images are uploaded, push Cloudinary URLs into images array
  if (Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = []
    for (const file of req.files) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'b2b-marketplace/products',
          resource_type: 'image',
          transformation: [
            {
              quality: 'auto:good',
              fetch_format: 'auto',
            },
          ],
        })
        imageUrls.push(uploadResult.secure_url)
      } catch (error) {
        console.error('[updateProduct] Failed to upload image to Cloudinary:', {
          path: file.path,
          message: error.message,
        })
      } finally {
        try {
          fs.unlinkSync(file.path)
        } catch {
          // ignore
        }
      }
    }
    if (imageUrls.length) {
      update.$push = { images: { $each: imageUrls } }
    }
  }

  let product = await Product.findByIdAndUpdate(req.params.id, update, { new: true })

  // Auto-correct status based on price validity:
  // If product was moved to "To Be Offered" because validity expired,
  // and now validity is in future, bring it back to "Live".
  if (product && product.status === 'To Be Offered' && !isPriceValidityExpired(product)) {
    product.status = 'Live'
    await product.save()
  }

  return res.status(StatusCodes.OK).json(success(product, 'Product updated'))
})

export const deleteProduct = catchAsync(async (req, res) => {
  const filter = { _id: req.params.id }

  // Sellers can only delete their own products; admins can delete any
  if (req.user.role === 'seller') {
    filter.seller = req.user.id
  }

  const product = await Product.findOneAndDelete(filter)

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json(success(null, 'Product not found'))
  }

  // (Optional) We are not deleting images from Cloudinary here to keep MVP simple
  return res.status(StatusCodes.OK).json(success(null, 'Product deleted'))
})

export const adminUpdateProductStatus = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can update product status')
  }

  const { status } = req.body
  const allowedStatuses = ['Draft', 'Pending', 'Live', 'Rejected', 'To Be Offered']

  if (!status || !allowedStatuses.includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid product status')
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  ).populate('category seller', 'name')

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  }

  return res.status(StatusCodes.OK).json(success(product, 'Product status updated'))
})



