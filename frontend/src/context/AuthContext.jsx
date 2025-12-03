import { createContext, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getUser, setUser as saveUser, clearAuth } from '../utils/storage.js'
import { getCurrentUser } from '../services/authService.js'

export const AuthContext = createContext({ user: null, loading: true, setUser: () => {} })

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First, try to get user from localStorage
        const storedUser = getUser()
        if (storedUser) {
          setUser(storedUser)
          setLoading(false) // Set loading to false immediately if user exists in storage
          
          // Then, verify token in background (non-blocking)
          getCurrentUser()
            .then((response) => {
              if (response.data) {
                const userData = response.data
                setUser(userData)
                saveUser(userData)
              }
            })
            .catch((error) => {
              // If API call fails, clear stored auth
              console.warn('Failed to verify user session:', error.message)
              clearAuth()
              setUser(null)
            })
        } else {
          // No stored user, set loading to false
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        clearAuth()
        setUser(null)
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = (userData) => {
    setUser(userData)
    setLoading(false) // Ensure loading is false when user is set
    if (userData) {
      saveUser(userData)
    } else {
      clearAuth()
    }
  }

  const value = useMemo(
    () => ({
      user,
      setUser: updateUser,
      loading,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
