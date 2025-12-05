import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'
import VerifiedBadge from '../common/VerifiedBadge.jsx'
import OptimizedImage from '../common/OptimizedImage.jsx'
import { getFallbackImage } from '../../constants/images.js'

const resolveImage = (product) => {
  const candidate = product.gallery?.[0]
  if (candidate && candidate.startsWith('http')) return candidate
  if (candidate) return `${candidate}`
  return null
}

const ProductCard = ({ product }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white/95 to-teal-50/60 shadow-[0_20px_55px_rgba(37,99,235,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(37,99,235,0.24)]">
    <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-neutral-100 mx-3 mt-3">
      <OptimizedImage
        src={resolveImage(product)}
        alt={product.name}
        fallbackCategory={product.categoryLabel}
        className="h-44 w-full object-cover transition duration-300 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
        {product.categoryLabel}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>

    <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-xs text-neutral-600 line-clamp-2">{product.shortDescription}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-blue-300/70 bg-blue-500/5 px-4 py-1 text-xs font-semibold text-blue-700">
          ₹{product.priceMin} – ₹{product.priceMax}
        </span>
        <span className="rounded-full border border-teal-200/70 bg-teal-500/5 px-3 py-1 text-[11px] font-semibold text-teal-700">
          MOQ {product.moq} units
        </span>
        <span className="rounded-full border border-yellow-200/80 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold text-yellow-700">
          Ready for RFQ
        </span>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-3 text-xs text-neutral-600 shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-neutral-900">{product.seller}</p>
          {product.sellerVerified && <VerifiedBadge size="sm" showText={false} />}
        </div>
        <p className="mt-0.5">
          {product.city}, {product.state}
        </p>
      </div>

      <div className="mt-auto flex gap-3 pt-1">
        <Button
          as={Link}
          to={`/buyer/products/${product.id}`}
          size="sm"
          className="flex-1 justify-center rounded-full text-xs font-semibold"
        >
          View details
        </Button>
        <Button
          as={Link}
          to={`/buyer/rfq/${product.id}`}
          size="sm"
          variant="secondary"
          className="rounded-full text-xs font-semibold"
        >
          RFQ
        </Button>
      </div>
    </div>
  </article>
)

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    priceMin: PropTypes.number.isRequired,
    priceMax: PropTypes.number.isRequired,
    moq: PropTypes.number.isRequired,
    seller: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
    categoryLabel: PropTypes.string,
    sellerVerified: PropTypes.bool,
  }).isRequired,
}

export default ProductCard
