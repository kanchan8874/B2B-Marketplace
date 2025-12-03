import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const ProtectedRoute = ({ allowed, children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  allowed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
