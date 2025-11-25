import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'

const fallbackImages = {
  'Food & Agriculture': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80',
  'Health & Pharma': 'https://images.unsplash.com/photo-1580281780460-82d277b0c30d?auto=format&fit=crop&w=900&q=80',
  Packaging: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'Industrial Supplies': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
}

const resolveImage = (product) => {
  const candidate = product.gallery?.[0]
  if (candidate && candidate.startsWith('http')) return candidate
  if (candidate) return `${candidate}`
  return fallbackImages[product.categoryLabel] || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
}

const ProductCard = ({ product }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_25px_60px_rgba(15,98,254,0.12)] transition hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(15,98,254,0.18)]">
    <div className="relative overflow-hidden rounded-b-[32px] rounded-t-[32px] border border-white/50 bg-neutral-100">
      <img
        src={resolveImage(product)}
        alt={product.name}
        className="h-48 w-full object-cover transition duration-300 ease-out hover:scale-105"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src =
            fallbackImages[product.categoryLabel] || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
        }}
      />
    </div>
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">{product.categoryLabel}</p>
        <h3 className="mt-2 text-xl font-semibold text-neutral-900">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-600">{product.shortDescription}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-1 text-sm font-semibold text-brand-primary">
          ₹{product.priceMin} – ₹{product.priceMax}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
          MOQ {product.moq} units
        </span>
      </div>
      <div className="rounded-2xl border border-surface-border/80 bg-neutral-50/80 p-4 text-sm text-neutral-600">
        <p className="font-semibold text-neutral-900">{product.seller}</p>
        <p>
          {product.city}, {product.state}
        </p>
      </div>
      <div className="mt-auto flex gap-3">
        <Button as={Link} to={`/buyer/products/${product.id}`} className="flex-1 text-center">
          View details
        </Button>
        <Button as={Link} to={`/buyer/rfq/${product.id}`} variant="secondary">
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
  }).isRequired,
}

export default ProductCard
