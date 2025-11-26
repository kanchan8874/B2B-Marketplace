import { StatusCodes } from 'http-status-codes'
import { Product } from '../models/Product.js'
import { RFQ } from '../models/RFQ.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

export const getBuyerDashboard = catchAsync(async (req, res) => {
  const [categoriesCount, productsCount, openRFQs] = await Promise.all([
    Product.distinct('category').then((ids) => ids.length),
    Product.countDocuments({ status: 'Live' }),
    RFQ.countDocuments({ buyer: req.user.id, status: 'Pending Response' }),
  ])

  return res.status(StatusCodes.OK).json(
    success({
      categoriesCount,
      productsCount,
      openRFQs,
    }),
  )
})

export const getSellerDashboard = catchAsync(async (req, res) => {
  const [totalProducts, liveProducts, pendingApprovals, openRFQs, responsesThisWeek] = await Promise.all([
    Product.countDocuments({ seller: req.user.id }),
    Product.countDocuments({ seller: req.user.id, status: 'Live' }),
    Product.countDocuments({ seller: req.user.id, status: 'Pending' }),
    RFQ.countDocuments({ seller: req.user.id, status: 'Pending Response' }),
    RFQ.countDocuments({
      seller: req.user.id,
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ])

  return res.status(StatusCodes.OK).json(
    success({
      totalProducts,
      liveProducts,
      pendingApprovals,
      openRFQs,
      responsesThisWeek,
    }),
  )
})

export const getAdminDashboard = catchAsync(async (req, res) => {
  const [totalProducts, pendingProducts, totalRFQs] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'Pending' }),
    RFQ.countDocuments(),
  ])

  return res.status(StatusCodes.OK).json(
    success({
      totalProducts,
      pendingProducts,
      totalRFQs,
    }),
  )
})


