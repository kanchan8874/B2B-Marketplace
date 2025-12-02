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
 * Send a message from buyer to seller
 */
export const sendMessage = async (receiverId, productId, subject, body) => {
  const response = await fetch(`${API_BASE_URL}/messages/send`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      receiverId,
      productId: productId || undefined,
      subject,
      body,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send message')
  }

  return response.json()
}

/**
 * Get all conversations for current user
 */
export const getConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch conversations')
  }

  return response.json()
}

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = async (conversationId) => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch messages')
  }

  return response.json()
}

/**
 * Reply to a conversation
 */
export const replyToConversation = async (conversationId, body) => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/reply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ body }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send reply')
  }

  return response.json()
}

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to mark message as read')
  }

  return response.json()
}

/**
 * Admin: Get all conversations
 */
export const getAllConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/messages/admin/conversations`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch conversations')
  }

  return response.json()
}

/**
 * Admin: Get messages for a conversation
 */
export const getConversationMessagesAdmin = async (conversationId) => {
  const response = await fetch(`${API_BASE_URL}/messages/admin/conversations/${conversationId}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch messages')
  }

  return response.json()
}

