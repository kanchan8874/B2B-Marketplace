import { StatusCodes } from 'http-status-codes'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { ApiError } from '../utils/ApiError.js'
import { getTierConfig, getProductLimit, getRemainingSlots } from '../config/subscriptionTiers.js'

/**
 * Get seller subscription info
 */
export const getSellerSubscription = catchAsync(async (req, res) => {
  if (req.user.role !== 'seller') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only sellers can view subscription info')
  }

  const seller = await User.findById(req.user.id)
  if (!seller) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Seller not found')
  }

  // Count current products (excluding drafts)
  const currentProductCount = await Product.countDocuments({
    seller: req.user.id,
    status: { $in: ['Live', 'Pending'] },
  })

  const tierConfig = getTierConfig(seller.subscriptionTier)
  const limit = getProductLimit(seller.subscriptionTier)
  const remaining = getRemainingSlots(currentProductCount, seller.subscriptionTier)

  return res.status(StatusCodes.OK).json(
    success({
      tier: seller.subscriptionTier,
      tierConfig,
      currentProductCount,
      productLimit: limit,
      remainingSlots: remaining,
      canAddMore: remaining > 0,
    }),
  )
})

/**
 * Admin: Update seller subscription tier
 */
export const updateSellerSubscription = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can update subscription tiers')
  }

  const { sellerId } = req.params
  const { tier } = req.body

  if (!['Silver', 'Gold', 'Platinum'].includes(tier)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid subscription tier')
  }

  const seller = await User.findById(sellerId)
  if (!seller || seller.role !== 'seller') {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Seller not found')
  }

  seller.subscriptionTier = tier
  await seller.save()

  return res.status(StatusCodes.OK).json(success(seller, 'Subscription tier updated'))
})

