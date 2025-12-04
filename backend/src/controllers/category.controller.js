import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import { Category } from '../models/Category.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import cloudinary from '../config/cloudinary.js'

export const categoryValidation = {
  upsert: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow('', null),
      icon: Joi.string().allow('', null),
      image: Joi.string().allow('', null), // Will be set from Cloudinary upload
      slug: Joi.string().allow('', null),
      isActive: Joi.boolean().optional(),
    }).required(),
  }),
}

export const listCategories = catchAsync(async (req, res) => {
  // Return categories with their dedicated image field (uploaded by admin)
  const categories = await Category.find({ isActive: true }).sort('name').lean()
  return res.status(StatusCodes.OK).json(success(categories))
})

export const createCategory = catchAsync(async (req, res) => {
  const body = { ...req.body }
  
  // Upload category image to Cloudinary if provided
  if (req.file) {
    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      throw new Error(`File not found at path: ${req.file.path}`)
    }
    
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'b2b-marketplace/categories',
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        ],
      })
      body.image = uploadResult.secure_url
      console.log('[createCategory] Image uploaded successfully:', uploadResult.secure_url)
    } catch (error) {
      // Log full error details for debugging
      console.error('[createCategory] Failed to upload image to Cloudinary:', {
        path: req.file.path,
        fileExists: fs.existsSync(req.file.path),
        fileSize: fs.existsSync(req.file.path) ? fs.statSync(req.file.path).size : 'N/A',
        errorType: error?.constructor?.name,
        errorMessage: error?.message,
        errorHttpCode: error?.http_code,
        errorName: error?.name,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      })
      // Remove local temp file even on error
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
      } catch {
        // ignore fs errors
      }
      // Throw error to prevent category creation without image if upload was attempted
      const errorMsg = error?.message || error?.http_code || 'Unknown Cloudinary error'
      throw new Error(`Failed to upload category image: ${errorMsg}`)
    }
    
    // Remove local temp file after successful upload
    try {
      fs.unlinkSync(req.file.path)
    } catch (unlinkError) {
      console.warn('[createCategory] Failed to remove temp file:', req.file.path, unlinkError)
    }
  }
  
  const category = await Category.create(body)
  return res.status(StatusCodes.CREATED).json(success(category, 'Category created'))
})

export const updateCategory = catchAsync(async (req, res) => {
  const body = { ...req.body }
  
  // Upload category image to Cloudinary if provided
  if (req.file) {
    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      throw new Error(`File not found at path: ${req.file.path}`)
    }
    
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'b2b-marketplace/categories',
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        ],
      })
      body.image = uploadResult.secure_url
      console.log('[updateCategory] Image uploaded successfully:', uploadResult.secure_url)
    } catch (error) {
      // Log full error details for debugging
      console.error('[updateCategory] Failed to upload image to Cloudinary:', {
        path: req.file.path,
        fileExists: fs.existsSync(req.file.path),
        fileSize: fs.existsSync(req.file.path) ? fs.statSync(req.file.path).size : 'N/A',
        errorType: error?.constructor?.name,
        errorMessage: error?.message,
        errorHttpCode: error?.http_code,
        errorName: error?.name,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      })
      // Remove local temp file even on error
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
      } catch {
        // ignore fs errors
      }
      // Throw error to prevent category update without image if upload was attempted
      const errorMsg = error?.message || error?.http_code || 'Unknown Cloudinary error'
      throw new Error(`Failed to upload category image: ${errorMsg}`)
    }
    
    // Remove local temp file after successful upload
    try {
      fs.unlinkSync(req.file.path)
    } catch (unlinkError) {
      console.warn('[updateCategory] Failed to remove temp file:', req.file.path, unlinkError)
    }
  }
  // If no new image uploaded, don't modify the image field (preserve existing)
  // Only update fields that are explicitly provided in req.body
  
  const category = await Category.findByIdAndUpdate(req.params.id, body, { new: true })
  return res.status(StatusCodes.OK).json(success(category, 'Category updated'))
})


