import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getFallbackImage } from '../../constants/images.js'

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Automatic lazy loading
 * - Error handling with fallback
 * - Async decoding for better performance
 * - Proper sizing attributes
 * - CDN-friendly
 */
const OptimizedImage = ({
  src,
  alt,
  fallback,
  fallbackCategory,
  className = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Update imgSrc when src prop changes
  useEffect(() => {
    setImgSrc(src)
    setHasError(false) // Reset error state when src changes
  }, [src])

  const handleError = (event) => {
    if (!hasError) {
      setHasError(true)
      const fallbackUrl = fallback || getFallbackImage(fallbackCategory)
      setImgSrc(fallbackUrl)
      if (onError) {
        onError(event)
      }
    }
  }

  // Use fallback if no src provided
  const finalSrc = imgSrc || fallback || getFallbackImage(fallbackCategory)

  return (
    <img
      src={finalSrc}
      alt={alt || ''}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...props}
    />
  )
}

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  fallback: PropTypes.string,
  fallbackCategory: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  decoding: PropTypes.oneOf(['async', 'sync', 'auto']),
  onError: PropTypes.func,
}

export default OptimizedImage

