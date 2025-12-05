/**
 * Centralized image constants for optimized loading
 * All fallback images use Unsplash with optimized query parameters
 */

// Base Unsplash URL with optimization parameters
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d'

// Optimized image URL generator
const getOptimizedImage = (width = 900, quality = 80) =>
  `${UNSPLASH_BASE}?auto=format&fit=crop&w=${width}&q=${quality}`

// Category-specific fallback images (optimized)
export const FALLBACK_IMAGES = {
  // Default fallback
  default: getOptimizedImage(900, 80),
  
  // Product detail pages (larger)
  productDetail: getOptimizedImage(1200, 80),
  productThumbnail: getOptimizedImage(400, 75),
  
  // Product cards (medium)
  productCard: getOptimizedImage(900, 80),
  productList: getOptimizedImage(200, 75),
  
  // Category-specific fallbacks
  'Food & Agriculture': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80',
  'Health & Pharma': 'https://images.unsplash.com/photo-1580281780460-82d277b0c30d?auto=format&fit=crop&w=900&q=80',
  Packaging: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'Industrial Supplies': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
  
  // Auth pages hero image (high quality, larger)
  authHero: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=90',
  authIllustration: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
}

// Get fallback image by category or use default
export const getFallbackImage = (category = null, type = 'default') => {
  if (category && FALLBACK_IMAGES[category]) {
    return FALLBACK_IMAGES[category]
  }
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default
}

export default FALLBACK_IMAGES

