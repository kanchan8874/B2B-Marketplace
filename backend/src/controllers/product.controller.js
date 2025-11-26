import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Product } from '../models/Product.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

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
      status: Joi.string().valid('Draft', 'Pending', 'Live').optional(),
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
  return res.status(StatusCodes.OK).json(success(products))
})

export const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category seller', 'name')
  return res.status(StatusCodes.OK).json(success(product))
})

export const createProduct = catchAsync(async (req, res) => {
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


