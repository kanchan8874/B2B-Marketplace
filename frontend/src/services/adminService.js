import { get, patch } from './httpClient.js'

/**
 * Get admin dashboard KPI summary
 * @returns {Promise<Object>} Admin dashboard metrics
 */
export const getAdminDashboardSummary = async () => {
  const response = await get('/dashboard/admin/summary')
  return response.data || {}
}

/**
 * Admin: List users (buyers/sellers)
 * @param {{ role?: 'buyer'|'seller', status?: string }} params
 */
export const listAdminUsers = async (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  const endpoint = query ? `/admin/users?${query}` : '/admin/users'

  const response = await get(endpoint)
  return response.data || []
}

/**
 * Admin: Update user active / blocked status
 * @param {string} id
 * @param {boolean} isActive
 */
export const updateUserStatus = async (id, isActive) => {
  const response = await patch(`/admin/users/${id}/status`, { isActive })
  return response.data
}

/**
 * Admin: Update user approval (e.g. seller approval)
 * @param {string} id
 * @param {boolean} isApproved
 */
export const updateUserApproval = async (id, isApproved) => {
  const response = await patch(`/admin/users/${id}/approval`, { isApproved })
  return response.data
}

/**
 * Admin: List products pending moderation
 * (small preview for dashboard – use dedicated endpoint)
 */
export const listPendingProductsAdmin = async () => {
  const response = await get('/admin/products/pending')
  return response.data || []
}

/**
 * Admin: List RFQs across marketplace
 * @param {{ status?: string }} params
 */
export const listRFQsAdmin = async (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  const endpoint = query ? `/admin/rfqs?${query}` : '/admin/rfqs'

  const response = await get(endpoint)
  return response.data || []
}

/**
 * Admin: Update seller subscription tier
 * @param {string} sellerId
 * @param {'Silver'|'Gold'|'Platinum'} tier
 */
export const updateSellerSubscriptionTier = async (sellerId, tier) => {
  const response = await patch(`/subscription/seller/${sellerId}`, { tier })
  return response.data
}

export default {
  getAdminDashboardSummary,
  listAdminUsers,
  listPendingProductsAdmin,
  listRFQsAdmin,
  updateUserStatus,
  updateUserApproval,
  updateSellerSubscriptionTier,
}
