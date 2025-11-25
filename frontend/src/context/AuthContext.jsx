import { createContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext({ user: null })

const defaultUser = null

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser)

  const value = useMemo(() => ({ user, setUser }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
