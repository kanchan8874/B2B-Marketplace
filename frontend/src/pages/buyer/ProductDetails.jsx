import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Truck, Tag, Heart, ShoppingBag, Check, MessageCircle } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import VerifiedBadge from '../../components/common/VerifiedBadge.jsx'
import FormField from '../../components/common/FormField.jsx'
import { getProductById } from '../../services/productService.js'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = useMemo(() => product?.category || null, [product])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [pincode, setPincode] = useState('')

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
        console.error('Failed to load product details:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load product details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-sm text-neutral-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800">
          {error || 'Product not found. Please go back to the catalogue and try again.'}
        </div>
      </div>
    )
  }

  const hydratedImages =
    product.images?.length > 0
      ? product.images.map((img) =>
          typeof img === 'string' && img.startsWith('http')
            ? img
            : 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
        )
      : ['https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80']

  // Images to display in gallery (main + thumbnails)
  const displayImages = hydratedImages
  
  // Calculate discount (mock calculation)
  const mrp = Math.round((product.priceMax || 0) * 1.8)
  const discount = product.priceMin ? Math.round(((mrp - product.priceMin) / mrp) * 100) : 0
  
  // Mock sizes for B2B products
  const sizes = [
    { label: `Standard Pack (${product.moq} units)`, price: product.priceMin, value: 'standard' },
    { label: `Bulk Pack (${product.moq * 2} units)`, price: Math.round(product.priceMin * 0.95), value: 'bulk' },
  ]

  const sellerName = product.seller?.name || product.seller?.companyName || 'Seller'

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to listing
      </button>

      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        {/* Left Side - Large image with thumbnails below (Flipkart-style) */}
        <div className="space-y-4">
          {/* Large Main Image on Top */}
          <div className="relative w-full overflow-hidden rounded-4xl bg-neutral-100 aspect-[5/5] md:h-[800px]">
            <img
              src={displayImages[selectedImage] || displayImages[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-300"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
              }}
            />
          </div>

          {/* Thumbnails row below main image */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {displayImages.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-200 ${
                  selectedImage === index
                    ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-2'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} - View ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&q=80'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Information */}
        <div className="space-y-6">
          {/* Brand & Product Name */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {sellerName}
            </p>
            <h1 className="text-2xl font-bold text-neutral-900 leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-neutral-700">4.4</span>
              </div>
              <span className="text-sm text-neutral-500">(53 Ratings)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neutral-900">
                ₹{product.priceMin?.toLocaleString?.() ?? '-'}
              </span>
              {product.priceMax && (
                <>
                  <span className="text-lg text-neutral-500 line-through">
                    ₹{mrp.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">({discount}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-xs text-neutral-500">inclusive of all taxes</p>
          </div>

          {/* Product Description */}
          {product.description && (
            <section aria-label="Product description" className="space-y-1">
              <p className="text-sm font-semibold text-neutral-700">Product description</p>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </section>
          )}

          {/* Size Selection */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-700">SELECT SIZE</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setSelectedSize(size.value)}
                  className={`px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                    selectedSize === size.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {size.label} - ₹{size.price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/buyer/rfq/${product._id}`)}
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Send RFQ
            </Button>
            <Button
              onClick={() => navigate(`/buyer/messages/contact?productId=${product._id}`)}
              variant="secondary"
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Seller
            </Button>
          </div>

          {/* Seller Information */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 via-white/95 to-teal-50/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Seller Information</p>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-semibold text-neutral-900">{sellerName}</p>
              {product.sellerVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-neutral-600">
              {product.city || 'N/A'}, {product.state || 'N/A'}
            </p>
            {category && (
              <p className="text-xs text-neutral-500 mt-2">
                Category: {category.name}
              </p>
            )}
          </div>

          {/* Commercial Terms */}
          {(product.priceValidityDate || product.paymentTerms || product.shipmentMode) && (
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 via-white/95 to-emerald-50/40 p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Commercial Terms</p>
              {product.priceValidityDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Price Validity:</span>
                  <span className="font-semibold text-neutral-900">
                    {new Date(product.priceValidityDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {product.paymentTerms && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Payment Terms:</span>
                  <span className="font-semibold text-neutral-900">{product.paymentTerms}</span>
                </div>
              )}
              {product.shipmentMode && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Shipment Mode:</span>
                  <span className="font-semibold text-neutral-900">{product.shipmentMode}</span>
                </div>
              )}
            </div>
          )}

          {/* Product Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
