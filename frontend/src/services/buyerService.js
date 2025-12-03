import { get } from './httpClient.js'

/**
 * Get buyer dashboard KPI summary
 * @returns {Promise<Object>} Buyer dashboard metrics
 */
export const getBuyerDashboardSummary = async () => {
  const response = await get('/dashboard/buyer/summary')
  // Backend returns { success, data: { ... } }
  return response.data || {}
}

/**
 * Get products for buyer dashboard (trending, recent etc.)
 * For now we reuse the same endpoint with simple filters/slicing.
 * @param {Object} params - Query params (e.g. { limit, search, category })
 * @returns {Promise<Array>} List of products
 */
export const getDashboardProducts = async (params = {}) => {
  const searchParams = new URLSearchParams()
  const withDefaults = { status: 'Live', ...params }
  Object.entries(withDefaults).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'

  const response = await get(endpoint, { includeAuth: false })
  return response.data || []
}

export default {
  getBuyerDashboardSummary,
  getDashboardProducts,
}

