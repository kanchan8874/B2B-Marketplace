import { get, post, patch } from './httpClient.js'

/**
 * Fetch all active categories for buyer flows
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
  const response = await get('/categories', { includeAuth: false })
  // Backend returns { success, data: [...] }
  return response.data || []
}

/**
 * Admin: Create a new category
 * @param {{ name: string, description?: string, icon?: string, slug?: string }} body
 */
export const createCategory = async (body) => {
  const response = await post('/categories', body, { includeAuth: true })
  return response.data
}

/**
 * Admin: Update an existing category (including toggling isActive)
 * @param {string} id
 * @param {Object} body
 */
export const updateCategory = async (id, body) => {
  const response = await patch(`/categories/${id}`, body, { includeAuth: true })
  return response.data
}

export default {
  getCategories,
  createCategory,
  updateCategory,
}

// Category API integration placeholder.
