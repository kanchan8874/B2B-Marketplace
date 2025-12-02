import PropTypes from 'prop-types'
import { CheckCircle } from 'lucide-react'

const VerifiedBadge = ({ size = 'sm', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <CheckCircle className={`${sizeClasses[size]} text-emerald-600 flex-shrink-0`} aria-hidden="true" />
      {showText && (
        <span className={`font-semibold text-emerald-700 ${textSizeClasses[size]}`}>Verified</span>
      )}
    </div>
  )
}

VerifiedBadge.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showText: PropTypes.bool,
  className: PropTypes.string,
}

export default VerifiedBadge

