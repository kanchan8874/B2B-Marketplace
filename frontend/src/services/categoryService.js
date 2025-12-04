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
 * @param {FormData|Object} body - FormData if image upload, otherwise plain object
 * @param {boolean} isFormData - Whether body is FormData
 */
export const createCategory = async (body, isFormData = false) => {
  const response = await post('/categories', body, { includeAuth: true, isFormData })
  return response.data
}

/**
 * Admin: Update an existing category (including toggling isActive)
 * @param {string} id
 * @param {FormData|Object} body - FormData if image upload, otherwise plain object
 * @param {boolean} isFormData - Whether body is FormData
 */
export const updateCategory = async (id, body, isFormData = false) => {
  const response = await patch(`/categories/${id}`, body, { includeAuth: true, isFormData })
  return response.data
}

export default {
  getCategories,
  createCategory,
  updateCategory,
}

// Category API integration placeholder.
