import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit3, MapPin, Layers, Package, Tag } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'
import { getProductById } from '../../services/productService.js'

const SellerProductView = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getProductById(productId)
        if (!isMounted) return
        if (!data) {
          setError('Product not found.')
        } else {
          setProduct(data)
        }
      } catch (err) {
        console.error('Failed to load product:', err)
        if (isMounted) setError(err.message || 'Failed to load product.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [productId])

  const hydratedImages = useMemo(() => {
    if (!product?.images?.length) {
      return [
        'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
      ]
    }
    return product.images.map((img) =>
      typeof img === 'string' && img.startsWith('http')
        ? img
        : 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
    )
  }, [product])

  const displayImages = hydratedImages

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-sm text-neutral-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="border-red-200 bg-red-50">
          <p className="px-4 py-6 text-sm text-red-800">
            {error || 'Product not found. Please go back to your catalogue and try again.'}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full px-3 py-1.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to catalogue
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full px-4 text-xs"
            onClick={() => navigate(`/seller/products/${product._id}/edit`)}
          >
            <Edit3 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Edit product
          </Button>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] items-stretch">
        {/* Left: image gallery */}
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-4xl bg-neutral-100 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            <img
              src={displayImages[selectedImage] || displayImages[0]}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
              }}
            />
          </div>

          {/* Image pagination dots */}
          {displayImages.length > 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full border border-white/60 transition-all ${
                      selectedImage === index ? 'bg-white shadow-sm scale-110' : 'bg-white/30'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    // allow click but keep wrapper pointer-events-none
                    style={{ pointerEvents: 'auto' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: product meta */}
        <Card
          title={product.name}
          subtitle={product.shortDescription}
          className="flex h-full flex-col border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/50 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
        >
          <div className="space-y-8 text-sm text-neutral-700">
            {/* Seller block */}
            <section className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Seller
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-500">Primary supplier</p>
                  <p className="mt-0.5 text-base font-semibold text-neutral-900">
                    {product.seller?.name || product.seller?.companyName || 'You'}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Internal view
                </span>
              </div>
            </section>

            {/* Commercials + Logistics blocks */}
            <section className="grid gap-8 border-t border-neutral-100 pt-6 md:grid-cols-2">
              {/* Commercials */}
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Commercials
                </p>
                <dl className="space-y-4">
                  <div className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      <Package className="h-4 w-4 text-neutral-500" />
                      Price band
                    </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        ₹{product.priceMin?.toLocaleString?.() ?? '-'} –{' '}
                        {product.priceMax?.toLocaleString?.() ?? '-'}
                      </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      <Layers className="h-4 w-4 text-neutral-500" />
                      MOQ
                    </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        {product.moq?.toLocaleString?.() ?? '-'} units
                      </dd>
                  </div>
                </dl>
              </div>

              {/* Logistics & classification */}
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Logistics &amp; classification
                </p>
                <dl className="space-y-4">
                  <div className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      Dispatch city / state
                    </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        {product.city || 'N/A'}, {product.state || 'N/A'}
                      </dd>
                  </div>
                  {product.category && (
                    <div className="space-y-1">
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        <Tag className="h-4 w-4 text-neutral-500" />
                        Category
                      </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        {product.category.name || 'Category'}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>

            {/* Tags block */}
            {product.tags?.length > 0 && (
              <section className="space-y-3 border-t border-neutral-100 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}

export default SellerProductView


