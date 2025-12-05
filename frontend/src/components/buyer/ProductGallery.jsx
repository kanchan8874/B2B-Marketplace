import PropTypes from 'prop-types'
import { useState } from 'react'
import OptimizedImage from '../common/OptimizedImage.jsx'
import { FALLBACK_IMAGES } from '../../constants/images.js'

const ProductGallery = ({ images = [] }) => {
  const hydratedImages = images.filter(Boolean).map((image) =>
    image?.startsWith('http') ? image : null
  )
  if (hydratedImages.length === 0) hydratedImages.push(null)

  const [active, setActive] = useState(0)

  return (
    <section aria-label="Product gallery" className="space-y-4">
      <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-surface-border bg-neutral-100">
        <OptimizedImage
          src={hydratedImages[active]}
          alt="Product image"
          fallback={FALLBACK_IMAGES.productDetail}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {hydratedImages.map((image, index) => (
          <button
            key={image || index}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActive(index)
            }}
            className={`h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              active === index 
                ? 'border-brand-primary ring-2 ring-brand-primary/30 ring-offset-2 scale-105' 
                : 'border-neutral-200 hover:border-neutral-400 hover:scale-105'
            }`}
            aria-label={`View image ${index + 1} of ${hydratedImages.length}`}
          >
            <OptimizedImage
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fallback={FALLBACK_IMAGES.productThumbnail}
              className="h-full w-full object-cover pointer-events-none"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ProductGallery
