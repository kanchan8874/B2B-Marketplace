import PropTypes from 'prop-types'
import { useState } from 'react'

const fallback = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'

const ProductGallery = ({ images = [] }) => {
  const hydratedImages = images.map((image) =>
    image?.startsWith('http')
      ? image
      : 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
  )
  if (hydratedImages.length === 0) hydratedImages.push(fallback)

  const [active, setActive] = useState(0)

  return (
    <section aria-label="Product gallery" className="space-y-4">
      <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-surface-border bg-neutral-100">
        <img
          src={hydratedImages[active]}
          alt=""
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = fallback
          }}
        />
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {hydratedImages.map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(index)}
            className={`h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border ${
              active === index ? 'border-brand-primary' : 'border-transparent'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
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
