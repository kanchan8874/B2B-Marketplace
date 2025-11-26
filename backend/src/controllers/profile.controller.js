import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User } from '../models/User.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

export const profileValidation = {
  updateMe: Joi.object({
    body: Joi.object({
      name: Joi.string().optional(),
      companyName: Joi.string().allow('', null),
      location: Joi.object({
        city: Joi.string().allow('', null),
        state: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
      }).optional(),
    }).required(),
  }),
}

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash')
  return res.status(StatusCodes.OK).json(success(user))
})

export const updateMe = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    select: '-passwordHash',
  })
  return res.status(StatusCodes.OK).json(success(user, 'Profile updated'))
})


