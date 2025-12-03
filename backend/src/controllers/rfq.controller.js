import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { RFQ } from '../models/RFQ.js'
import { RFQResponse } from '../models/RFQResponse.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

export const rfqValidation = {
  create: Joi.object({
    body: Joi.object({
      product: Joi.string().required(),
      seller: Joi.string().required(),
      quantity: Joi.number().required(),
      deliveryLocation: Joi.object({
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
      }).required(),
      expiresAt: Joi.date().optional(),
    }).required(),
  }),
  respond: Joi.object({
    body: Joi.object({
      finalPrice: Joi.number().required(),
      terms: Joi.string().allow('', null),
    }).required(),
  }),
}

export const listRFQs = catchAsync(async (req, res) => {
  const { role, id } = req.user
  const filter = {}

  if (role === 'buyer') {
    filter.buyer = id
  } else if (role === 'seller') {
    filter.seller = id
  }

  const rfqs = await RFQ.find(filter)
    .populate('product', 'name images priceMin priceMax moq')
    .populate('seller', 'name companyName')
    .populate('buyer', 'name companyName')
    .sort('-createdAt')

  return res.status(StatusCodes.OK).json(success(rfqs))
})

export const createRFQ = catchAsync(async (req, res) => {
  const body = {
    ...req.body,
    buyer: req.user.id,
  }
  const rfq = await RFQ.create(body)
  return res.status(StatusCodes.CREATED).json(success(rfq, 'RFQ created'))
})

export const getRFQ = catchAsync(async (req, res) => {
  const rfq = await RFQ.findById(req.params.id)
    .populate('product', 'name images priceMin priceMax moq')
    .populate('seller', 'name companyName')

  if (!rfq) {
    return res.status(StatusCodes.NOT_FOUND).json(success(null, 'RFQ not found'))
  }

  const responses = await RFQResponse.find({ rfq: rfq.id })
    .populate('seller', 'name companyName')
    .sort('-createdAt')

  return res.status(StatusCodes.OK).json(success({ rfq, responses }))
})

export const respondToRFQ = catchAsync(async (req, res) => {
  const rfq = await RFQ.findById(req.params.id)
  if (!rfq) {
    return res.status(StatusCodes.NOT_FOUND).json(success(null, 'RFQ not found'))
  }

  // Ensure only the owning seller can respond
  if (String(rfq.seller) !== req.user.id) {
    return res.status(StatusCodes.FORBIDDEN).json(success(null, 'Not allowed to respond to this RFQ'))
  }

  const response = await RFQResponse.create({
    rfq: rfq.id,
    seller: req.user.id,
    finalPrice: req.body.finalPrice,
    terms: req.body.terms,
  })

  rfq.status = 'Quoted'
  await rfq.save()

  return res.status(StatusCodes.CREATED).json(success(response, 'RFQ response submitted'))
})


