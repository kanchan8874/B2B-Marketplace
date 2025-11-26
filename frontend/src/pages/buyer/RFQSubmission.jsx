import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQForm from '../../components/buyer/RFQForm.jsx'
import { products } from '../../mocks/products.js'

const RFQSubmission = () => {
  const { productId } = useParams()
  const product = useMemo(() => products.find((item) => item.id === productId) ?? products[0], [productId])

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
      <Card
        title={`RFQ for ${product.name}`}
        subtitle="All fields are mandatory unless marked optional."
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_22px_70px_rgba(37,99,235,0.16)]"
      >
        <RFQForm productName={product.name} />
      </Card>
      <Card
        title="Product summary"
        className="border-blue-50 bg-gradient-to-br from-white via-blue-50/60 to-teal-50/60 shadow-[0_20px_60px_rgba(15,23,42,0.16)]"
      >
        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              {product.categoryId?.toUpperCase?.() || 'PRODUCT'}
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900">{product.name}</p>
            <p className="text-xs text-neutral-600 line-clamp-2">{product.shortDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-blue-100 bg-white/80 p-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">Price</p>
              <p className="text-sm font-semibold text-neutral-900">
                ₹{product.priceMin} – ₹{product.priceMax}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">MOQ</p>
              <p className="text-sm font-semibold text-neutral-900">{product.moq} units</p>
            </div>
          </div>

          <div className="space-y-1 rounded-2xl border border-blue-50 bg-white/90 p-3 text-xs">
            <p className="font-semibold text-neutral-900">Seller: {product.seller}</p>
            <p className="text-neutral-600">
              Location: {product.city}, {product.state}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RFQSubmission
