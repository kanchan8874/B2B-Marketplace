import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductGallery from '../../components/buyer/ProductGallery.jsx'
import SellerInfoCard from '../../components/buyer/SellerInfoCard.jsx'
import Card from '../../components/common/Card.jsx'
import RFQForm from '../../components/buyer/RFQForm.jsx'
import Button from '../../components/common/Button.jsx'
import { products } from '../../mocks/products.js'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => products.find((item) => item.id === productId) ?? products[0], [productId])

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to listing
      </button>
      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-5">
          <ProductGallery images={product.gallery} />
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">
              Product overview
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900 lg:text-3xl">{product.name}</h1>
            <p className="text-sm text-neutral-600 lg:text-base">{product.shortDescription}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Price range</p>
              <p className="text-xl font-semibold text-neutral-900">
                ₹{product.priceMin} – ₹{product.priceMax}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">MOQ</p>
              <p className="text-xl font-semibold text-neutral-900">{product.moq} units</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-200/60 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <SellerInfoCard seller={product.seller} city={product.city} state={product.state} />
        </div>
        <Card
          title={`Send RFQ to ${product.seller}`}
          subtitle="Quantity & delivery details only. No chat inside app."
          className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_24px_70px_rgba(37,99,235,0.18)]"
        >
          <RFQForm productName={product.name} />
          <Button
            size="lg"
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => navigate(`/buyer/rfq/${product.id}`)}
          >
            Open full RFQ page
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetails
