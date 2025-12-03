import { get, post, patch, del } from './httpClient.js'

/**
 * List products for catalogue / dashboards
 * @param {Object} params - Query params like { search, category, seller, page, limit }
 * @returns {Promise<Array>} List of products
 */
export const listProducts = async (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'

  const response = await get(endpoint, { includeAuth: params.includeAuth ?? false })
  return response.data || []
}

/**
 * Get a single product by ID
 * @param {string} id
 * @returns {Promise<Object>} Product details
 */
export const getProductById = async (id) => {
  const response = await get(`/products/${id}`, { includeAuth: false })
  return response.data
}

/**
 * Seller: Create a new product (multipart/form-data)
 * @param {FormData} formData
 */
export const createProduct = async (formData) => {
  const response = await post('/products', formData, { includeAuth: true, isFormData: true })
  return response.data
}

/**
 * Seller/Admin: Update an existing product (multipart/form-data)
 * @param {string} id
 * @param {FormData} formData
 */
export const updateProduct = async (id, formData) => {
  const response = await patch(`/products/${id}`, formData, { includeAuth: true, isFormData: true })
  return response.data
}

/**
 * Seller/Admin: Delete a product
 * (If backend supports DELETE /products/:id)
 */
export const deleteProduct = async (id) => {
  const response = await del(`/products/${id}`, { includeAuth: true })
  return response.data
}

/**
 * Admin: Update product status (moderation)
 * @param {string} id
 * @param {string} status - e.g. 'Live' | 'Pending' | 'Rejected'
 */
export const updateProductStatusAdmin = async (id, status) => {
  const response = await patch(
    `/products/${id}/status`,
    { status },
    { includeAuth: true },
  )
  return response.data
}

export default {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatusAdmin,
}

