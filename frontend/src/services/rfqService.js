import { get, post } from './httpClient.js'

/**
 * List RFQs for current user (buyer or seller)
 * @param {Object} params - Optional filters like { status }
 */
export const listRFQs = async (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/rfqs?${queryString}` : '/rfqs'

  const response = await get(endpoint)
  return response.data || []
}

/**
 * Get RFQ details by ID
 */
export const getRFQById = async (id) => {
  const response = await get(`/rfqs/${id}`)
  return response.data
}

/**
 * Buyer: Create a new RFQ
 */
export const createRFQ = async (body) => {
  const response = await post('/rfqs', body)
  return response.data
}

/**
 * Seller: Respond to an RFQ
 */
export const respondToRFQ = async (id, body) => {
  const response = await post(`/rfqs/${id}/respond`, body)
  return response.data
}

export default {
  listRFQs,
  getRFQById,
  createRFQ,
  respondToRFQ,
}

