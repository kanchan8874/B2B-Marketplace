import { Product } from '../models/Product.js'

/**
 * Check and update products with expired price validity
 * This should be run periodically (e.g., via cron job or scheduled task)
 */
export const updateExpiredPriceValidity = async () => {
  const now = new Date()

  // Find products with expired price validity that are still Live
  const expiredProducts = await Product.find({
    status: 'Live',
    priceValidityDate: { $exists: true, $lt: now },
  })

  if (expiredProducts.length === 0) {
    return { updated: 0 }
  }

  // Update status to "To Be Offered"
  const result = await Product.updateMany(
    {
      _id: { $in: expiredProducts.map((p) => p._id) },
    },
    {
      $set: { status: 'To Be Offered' },
    },
  )

  return { updated: result.modifiedCount }
}

/**
 * Check if a product's price validity has expired
 */
export const isPriceValidityExpired = (product) => {
  if (!product.priceValidityDate) {
    return false
  }
  const validityDate = new Date(product.priceValidityDate)
  const now = new Date()

  // Compare at date-level only (ignore time) so that validity
  // remains active for the entire calendar day.
  const validityDay = new Date(validityDate.getFullYear(), validityDate.getMonth(), validityDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Expired only if validity day is strictly before today
  return validityDay < today
}

/**
 * Get price validity status text
 */
export const getPriceValidityStatus = (product) => {
  if (!product.priceValidityDate) {
    return null
  }

  const validityDate = new Date(product.priceValidityDate)
  const now = new Date()
  const diffTime = validityDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: 'Expired', days: Math.abs(diffDays), expired: true }
  } else if (diffDays === 0) {
    return { text: 'Expires today', days: 0, expired: false }
  } else if (diffDays <= 7) {
    return { text: `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`, days: diffDays, expired: false }
  } else {
    return { text: `Valid until ${validityDate.toLocaleDateString()}`, days: diffDays, expired: false }
  }
}

