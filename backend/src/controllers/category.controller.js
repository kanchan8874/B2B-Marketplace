import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Category } from '../models/Category.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

export const categoryValidation = {
  upsert: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow('', null),
      icon: Joi.string().allow('', null),
      slug: Joi.string().allow('', null),
      isActive: Joi.boolean().optional(),
    }).required(),
  }),
}

export const listCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name')
  return res.status(StatusCodes.OK).json(success(categories))
})

export const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body)
  return res.status(StatusCodes.CREATED).json(success(category, 'Category created'))
})

export const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  return res.status(StatusCodes.OK).json(success(category, 'Category updated'))
})


