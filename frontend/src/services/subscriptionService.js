import { getAuthToken } from '../utils/storage.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  }
  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/**
 * Get Seller Subscription Info
 */
export const getSellerSubscription = async () => {
  const response = await fetch(`${API_BASE_URL}/subscription/seller`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch subscription info')
  }

  return response.json()
}

/**
 * Admin: Update Seller Subscription Tier
 */
export const updateSellerSubscription = async (sellerId, tier) => {
  const response = await fetch(`${API_BASE_URL}/subscription/seller/${sellerId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ tier }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update subscription tier')
  }

  return response.json()
}

