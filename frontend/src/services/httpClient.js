import { getAuthToken, clearAuth } from '../utils/storage.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Get headers for API requests
 * @param {boolean} includeAuth - Whether to include auth token
 * @param {boolean} isFormData - Whether request is FormData (don't set Content-Type)
 * @returns {Object} Headers object
 */
export const getHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {}
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  
  return headers
}

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise} Parsed response data
 */
const handleResponse = async (response) => {
  // Handle 401 Unauthorized - clear auth and redirect
  if (response.status === 401) {
    clearAuth()
    window.location.href = '/auth/buyer/login'
    throw new Error('Session expired. Please login again.')
  }

  // Some responses (304, 204) may have no body
  let data = null
  if (response.status !== 204 && response.status !== 304) {
    data = await response.json()
  } else {
    data = {}
  }
  
  if (!response.ok) {
    // Extract error message from response
    const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }
  
  return data
}

/**
 * HTTP Client - GET request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @returns {Promise} Response data
 */
export const get = async (endpoint, options = {}) => {
  const { includeAuth = true, ...fetchOptions } = options
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(includeAuth),
    ...fetchOptions,
  })
  
  return handleResponse(response)
}

/**
 * HTTP Client - POST request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} body - Request body
 * @param {Object} options - Request options
 * @returns {Promise} Response data
 */
export const post = async (endpoint, body, options = {}) => {
  const { includeAuth = true, isFormData = false, ...fetchOptions } = options
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(includeAuth, isFormData),
    body: isFormData ? body : JSON.stringify(body),
    ...fetchOptions,
  })
  
  return handleResponse(response)
}

/**
 * HTTP Client - PUT request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} body - Request body
 * @param {Object} options - Request options
 * @returns {Promise} Response data
 */
export const put = async (endpoint, body, options = {}) => {
  const { includeAuth = true, isFormData = false, ...fetchOptions } = options
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(includeAuth, isFormData),
    body: isFormData ? body : JSON.stringify(body),
    ...fetchOptions,
  })
  
  return handleResponse(response)
}

/**
 * HTTP Client - PATCH request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} body - Request body
 * @param {Object} options - Request options
 * @returns {Promise} Response data
 */
export const patch = async (endpoint, body, options = {}) => {
  const { includeAuth = true, isFormData = false, ...fetchOptions } = options
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(includeAuth, isFormData),
    body: isFormData ? body : JSON.stringify(body),
    ...fetchOptions,
  })
  
  return handleResponse(response)
}

/**
 * HTTP Client - DELETE request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @returns {Promise} Response data
 */
export const del = async (endpoint, options = {}) => {
  const { includeAuth = true, ...fetchOptions } = options
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(includeAuth),
    ...fetchOptions,
  })
  
  return handleResponse(response)
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
}
