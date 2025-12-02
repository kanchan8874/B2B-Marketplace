import { getAuthToken } from '../utils/storage.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  return headers
}

const getFormDataHeaders = (includeAuth = true) => {
  const headers = {}
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  return headers
}

// ========== SELLER KYC ==========

/**
 * Submit Seller KYC
 */
export const submitSellerKYC = async (formData) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  const response = await fetch(`${API_BASE_URL}/kyc/seller/submit`, {
    method: 'POST',
    headers: getFormDataHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit KYC')
  }

  return response.json()
}

/**
 * Get Seller KYC Status
 */
export const getSellerKYC = async () => {
  const response = await fetch(`${API_BASE_URL}/kyc/seller`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch KYC status')
  }

  return response.json()
}

/**
 * Admin: Get Pending Seller KYCs
 */
export const getPendingSellerKYCs = async (status = 'Pending', page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/kyc/seller/pending?status=${status}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch pending KYCs')
  }

  return response.json()
}

/**
 * Admin: Approve Seller KYC
 */
export const approveSellerKYC = async (kycId) => {
  const response = await fetch(`${API_BASE_URL}/kyc/seller/${kycId}/approve`, {
    method: 'POST',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to approve KYC')
  }

  return response.json()
}

/**
 * Admin: Reject Seller KYC
 */
export const rejectSellerKYC = async (kycId, rejectionReason) => {
  const response = await fetch(`${API_BASE_URL}/kyc/seller/${kycId}/reject`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ rejectionReason }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reject KYC')
  }

  return response.json()
}

// ========== BUYER KYC ==========

/**
 * Submit Buyer KYC
 */
export const submitBuyerKYC = async (formData) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  const response = await fetch(`${API_BASE_URL}/kyc/buyer/submit`, {
    method: 'POST',
    headers: getFormDataHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit KYC')
  }

  return response.json()
}

/**
 * Get Buyer KYC Status
 */
export const getBuyerKYC = async () => {
  const response = await fetch(`${API_BASE_URL}/kyc/buyer`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch KYC status')
  }

  return response.json()
}

/**
 * Admin: Get Pending Buyer KYCs
 */
export const getPendingBuyerKYCs = async (status = 'Pending', page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/kyc/buyer/pending?status=${status}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch pending KYCs')
  }

  return response.json()
}

/**
 * Admin: Approve Buyer KYC
 */
export const approveBuyerKYC = async (kycId) => {
  const response = await fetch(`${API_BASE_URL}/kyc/buyer/${kycId}/approve`, {
    method: 'POST',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to approve KYC')
  }

  return response.json()
}

/**
 * Admin: Reject Buyer KYC
 */
export const rejectBuyerKYC = async (kycId, rejectionReason) => {
  const response = await fetch(`${API_BASE_URL}/kyc/buyer/${kycId}/reject`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ rejectionReason }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reject KYC')
  }

  return response.json()
}

