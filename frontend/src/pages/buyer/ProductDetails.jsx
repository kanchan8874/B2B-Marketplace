import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Truck, Tag, Heart, ShoppingBag, Check } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { products } from '../../mocks/products.js'
import { categories } from '../../mocks/categories.js'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => products.find((item) => item.id === productId) ?? products[0], [productId])
  const category = categories.find((cat) => cat.id === product.categoryId)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [pincode, setPincode] = useState('')
  
  const hydratedImages = product.gallery?.length > 0 
    ? product.gallery.map((img) => img?.startsWith('http') ? img : 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80')
    : ['https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80']
  
  // Ensure we have at least 4 images for the 2x2 grid
  const displayImages = []
  if (hydratedImages.length >= 4) {
    displayImages.push(...hydratedImages.slice(0, 4))
  } else {
    displayImages.push(...hydratedImages)
    // Fill remaining slots with repeated images or fallback
    while (displayImages.length < 4) {
      displayImages.push(hydratedImages[displayImages.length % hydratedImages.length] || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80')
    }
  }
  
  // Calculate discount (mock calculation)
  const mrp = Math.round(product.priceMax * 1.8)
  const discount = Math.round(((mrp - product.priceMin) / mrp) * 100)
  
  // Mock sizes for B2B products
  const sizes = [
    { label: `Standard Pack (${product.moq} units)`, price: product.priceMin, value: 'standard' },
    { label: `Bulk Pack (${product.moq * 2} units)`, price: Math.round(product.priceMin * 0.95), value: 'bulk' },
  ]

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
        {/* Left Side - Large Image on Top, 2x2 Grid Below */}
        <div className="space-y-4">
          {/* Large Main Image on Top */}
          <div className="aspect-square overflow-hidden rounded-4xl bg-neutral-100">
            <img
              src={displayImages[selectedImage] || displayImages[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-300"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
              }}
            />
          </div>

          {/* 2x2 Thumbnail Grid Below - 2 images on top, 2 images below */}
          <div className="grid grid-cols-2 gap-4">
            {displayImages.map((image, index) => (
              <div
                key={index}
                className={`aspect-square overflow-hidden rounded-4xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  selectedImage === index ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} - View ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Information */}
        <div className="space-y-6">
          {/* Brand & Product Name */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              {product.seller}
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
                ₹{product.priceMin.toLocaleString()}
              </span>
              <span className="text-lg text-neutral-500 line-through">
                ₹{mrp.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                ({discount}% OFF)
              </span>
            </div>
            <p className="text-xs text-neutral-500">inclusive of all taxes</p>
          </div>

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
              onClick={() => navigate(`/buyer/rfq/${product.id}`)}
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Send RFQ
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="px-6 flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Button>
          </div>

          {/* Delivery Options */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-neutral-600" />
              <h3 className="text-sm font-bold text-neutral-900">DELIVERY OPTIONS</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="secondary" className="px-6">
                Check
              </Button>
            </div>
            <p className="text-xs text-neutral-600">
              Please enter PIN code to check delivery time & Pay on Delivery Availability
            </p>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>100% Original Products</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Pay on delivery might be available</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Easy 14 days returns and exchanges</span>
              </li>
            </ul>
          </div>

          {/* Best Offers */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-neutral-600" />
              <h3 className="text-sm font-bold text-neutral-900">BEST OFFERS</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-700">
                  Best Price: <span className="font-bold text-red-600">Rs. {Math.round(product.priceMin * 0.85).toLocaleString()}</span>
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-600 ml-4">
                  <li className="list-disc">Applicable on: Orders above Rs. {(product.priceMin * 2).toLocaleString()} (only on first purchase)</li>
                  <li className="list-disc">Coupon code: B2B300</li>
                  <li className="list-disc">Coupon Discount: Rs. {Math.round(product.priceMin * 0.15)} off (check cart for final savings)</li>
                </ul>
                <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">
                  View Eligible Products
                </button>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 via-white/95 to-teal-50/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Seller Information</p>
            <p className="text-base font-semibold text-neutral-900 mb-1">{product.seller}</p>
            <p className="text-sm text-neutral-600">
              {product.city}, {product.state}
            </p>
            {category && (
              <p className="text-xs text-neutral-500 mt-2">
                Category: {category.name}
              </p>
            )}
          </div>

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
