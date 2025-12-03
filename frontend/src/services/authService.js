import { get, post } from './httpClient.js'
import { setAuthToken, setUser, clearAuth } from '../utils/storage.js'

/**
 * Signup - Register new buyer or seller
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.role - User role ('buyer' or 'seller')
 * @param {string} [userData.companyName] - Company name (optional)
 * @param {string} [userData.gstNumber] - GST number (optional)
 * @param {string} [userData.phone] - Phone number (optional)
 * @param {Object} [userData.location] - Location object (optional)
 * @returns {Promise<Object>} Response with token and user data
 */
export const signup = async (userData) => {
  try {
    const response = await post('/auth/signup', userData, { includeAuth: false })
    
    // Store token and user data
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    if (response.data?.user) {
      setUser(response.data.user)
    }
    
    return response
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

/**
 * Login - Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with token and user data
 */
export const login = async (email, password) => {
  try {
    const response = await post('/auth/login', { email, password }, { includeAuth: false })
    
    // Store token and user data
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    if (response.data?.user) {
      setUser(response.data.user)
    }
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Admin Login - Authenticate admin with static credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Response with token and admin user data
 */
export const adminLogin = async (email, password) => {
  try {
    const response = await post('/auth/admin/login', { email, password }, { includeAuth: false })

    // Store token and user data
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    if (response.data?.user) {
      setUser(response.data.user)
    }

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    throw error
  }
}

/**
 * Get Current User - Fetch authenticated user details
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await get('/auth/me')
    
    // Update stored user data
    if (response.data) {
      setUser(response.data)
    }
    
    return response
  } catch (error) {
    console.error('Get current user error:', error)
    // If token is invalid, clear auth
    if (error.message.includes('Session expired') || error.message.includes('401')) {
      clearAuth()
    }
    throw error
  }
}

/**
 * Send OTP - Send OTP to email or phone
 * @param {string} [email] - User email
 * @param {string} [phone] - User phone
 * @returns {Promise<Object>} Response with success message
 */
export const sendOtp = async (email, phone) => {
  try {
    const body = {}
    if (email) body.email = email
    if (phone) body.phone = phone

    const response = await post('/auth/otp/send', body, { includeAuth: false })
    return response
  } catch (error) {
    console.error('Send OTP error:', error)
    throw error
  }
}

/**
 * Verify OTP - Verify OTP and login
 * @param {string} otp - 6-digit OTP code
 * @param {string} [email] - User email
 * @param {string} [phone] - User phone
 * @returns {Promise<Object>} Response with token and user data
 */
export const verifyOtp = async (otp, email, phone) => {
  try {
    const body = { otp }
    if (email) body.email = email
    if (phone) body.phone = phone

    const response = await post('/auth/otp/verify', body, { includeAuth: false })

    // Store token and user data
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    if (response.data?.user) {
      setUser(response.data.user)
    }

    return response
  } catch (error) {
    console.error('Verify OTP error:', error)
    throw error
  }
}

/**
 * Logout - Clear authentication data
 */
export const logout = () => {
  clearAuth()
  // Redirect to home page
  window.location.href = '/'
}

export default {
  signup,
  login,
  adminLogin,
  getCurrentUser,
  sendOtp,
  verifyOtp,
  logout,
}
