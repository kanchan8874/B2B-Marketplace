import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Layers, Package, Tag, ShieldCheck } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'
import { getProductById } from '../../services/productService.js'

const AdminProductView = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getProductById(productId)
        if (!isMounted) return
        if (!data) {
          setError('Product not found.')
        } else {
          setProduct(data)
        }
      } catch (err) {
        console.error('[AdminProductView] Failed to load product', err)
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

  const images = useMemo(() => {
    return product?.images?.filter((img) => typeof img === 'string' && img.trim()) || []
  }, [product])

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
            {error || 'Product not found. Please go back to the products list and try again.'}
          </p>
        </Card>
      </div>
    )
  }

  const sellerName = product.seller?.name || product.seller?.companyName || 'Seller'
  const categoryName = product.category?.name || 'Category'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to products
        </button>
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Admin view only
        </span>
      </div>

      <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-4xl bg-neutral-100 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            <OptimizedImage
              src={images[selectedImage] || images[0]}
              alt={product.name}
              fallback={FALLBACK_IMAGES.productDetail}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={img || index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedImage(index)
                  }}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedImage === index
                      ? 'border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.45)] ring-2 ring-blue-400/30 ring-offset-1 scale-105'
                      : 'border-neutral-200 hover:border-blue-400 hover:scale-105'
                  }`}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                >
                  <OptimizedImage
                    src={img}
                    alt="Thumbnail"
                    fallback={FALLBACK_IMAGES.productThumbnail}
                    className="h-full w-full object-cover pointer-events-none"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <Card
          title={product.name}
          subtitle={product.shortDescription}
          className="flex h-full flex-col border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/50 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
        >
          <div className="space-y-8 text-sm text-neutral-700">
            <section className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Seller</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-500">Listed by</p>
                  <p className="mt-0.5 text-base font-semibold text-neutral-900">{sellerName}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-8 border-t border-neutral-100 pt-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Commercials</p>
                <dl className="space-y-4">
                  <div className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      <Package className="h-4 w-4 text-neutral-500" />
                      Price band
                    </dt>
                    <dd className="text-base font-semibold text-neutral-900">
                      ₹{product.priceMin?.toLocaleString?.() ?? '-'} – {product.priceMax?.toLocaleString?.() ?? '-'}
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
                  <div className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      <Tag className="h-4 w-4 text-neutral-500" />
                      Category
                    </dt>
                    <dd className="text-base font-semibold text-neutral-900">{categoryName}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {product.tags?.length > 0 && (
              <section className="space-y-3 border-t border-neutral-100 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Tags</p>
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

export default AdminProductView
