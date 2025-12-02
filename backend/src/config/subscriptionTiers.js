// Subscription Tier Configuration
// Defines product listing limits for each tier

export const SUBSCRIPTION_TIERS = {
  Silver: {
    name: 'Silver',
    productLimit: 10,
    displayName: 'Silver',
    color: 'neutral',
  },
  Gold: {
    name: 'Gold',
    productLimit: 50,
    displayName: 'Gold',
    color: 'yellow',
  },
  Platinum: {
    name: 'Platinum',
    productLimit: 200,
    displayName: 'Platinum',
    color: 'purple',
  },
}

/**
 * Get subscription tier configuration
 */
export const getTierConfig = (tier) => {
  return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.Silver
}

/**
 * Get product limit for a tier
 */
export const getProductLimit = (tier) => {
  return getTierConfig(tier).productLimit
}

/**
 * Check if seller can add more products
 */
export const canAddProduct = (currentProductCount, tier) => {
  const limit = getProductLimit(tier)
  return currentProductCount < limit
}

/**
 * Get remaining product slots
 */
export const getRemainingSlots = (currentProductCount, tier) => {
  const limit = getProductLimit(tier)
  return Math.max(0, limit - currentProductCount)
}

