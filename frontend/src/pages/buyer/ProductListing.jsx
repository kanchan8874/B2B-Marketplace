import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { products } from '../../mocks/products.js'
import { categories } from '../../mocks/categories.js'

const ProductListing = () => {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const categoryId = searchParams.get('category')
  const navigate = useNavigate()
  const scrollRefs = useRef({})
  const [scrollStates, setScrollStates] = useState({})

  // Group products by category
  const productsByCategory = useMemo(() => {
    let filteredProducts = products

    // Filter by category if specified
    if (categoryId) {
      filteredProducts = filteredProducts.filter((product) => product.categoryId === categoryId)
    }

    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Enrich products with category labels
    const enriched = filteredProducts.map((product) => ({
      ...product,
      categoryLabel: categories.find((cat) => cat.id === product.categoryId)?.name,
    }))

    // Group by category
    const grouped = {}
    enriched.forEach((product) => {
      const categoryName = product.categoryLabel || 'Other'
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(product)
    })

    // Return categories in order
    return categories
      .map((cat) => ({
        category: cat,
        products: grouped[cat.name] || [],
      }))
      .filter((group) => group.products.length > 0)
  }, [categoryId, searchQuery])

  const resolveImage = (product) => {
    const candidate = product.gallery?.[0]
    if (candidate && candidate.startsWith('http')) return candidate
    return 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
  }

  const scrollCategory = useCallback((categoryId, direction) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      const scrollAmount = 400
      const currentScroll = scrollContainer.scrollLeft
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      let newScrollLeft
      if (direction === 'left') {
        newScrollLeft = Math.max(0, currentScroll - scrollAmount)
      } else {
        newScrollLeft = Math.min(maxScroll, currentScroll + scrollAmount)
      }
      
      scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
      
      // Update scroll state after scroll
      setTimeout(() => {
        if (scrollContainer) {
          setScrollStates((prev) => ({
            ...prev,
            [categoryId]: {
              canScrollLeft: scrollContainer.scrollLeft > 0,
              canScrollRight: scrollContainer.scrollLeft < maxScroll - 10,
            },
          }))
        }
      }, 300)
    }
  }, [])

  const checkScrollState = useCallback((categoryId) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      setScrollStates((prev) => ({
        ...prev,
        [categoryId]: {
          canScrollLeft: scrollContainer.scrollLeft > 0,
          canScrollRight: scrollContainer.scrollLeft < maxScroll - 10,
        },
      }))
    }
  }, [])

  // Initialize scroll states for all categories
  useEffect(() => {
    const timer = setTimeout(() => {
      productsByCategory.forEach(({ category }) => {
        checkScrollState(category.id)
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [productsByCategory, checkScrollState])

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <Card
        title="Product catalogue"
        subtitle={
          categoryId
            ? `Showing products in ${categories.find((cat) => cat.id === categoryId)?.name}`
            : 'Browse verified suppliers with MOQ, price band, and seller context.'
        }
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="productSearch"
            label="Keyword search"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            icon={Search}
          />
        </div>
      </Card>

      {/* Products Grouped by Category */}
      {productsByCategory.length > 0 ? (
        <div className="space-y-10">
          {productsByCategory.map(({ category, products: categoryProducts }) => (
            <section key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{category.name}</h2>
                  <p className="mt-1 text-sm text-neutral-600">{category.description}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>

              {/* Horizontal Scrollable Product Cards */}
              <div className="relative">
                <div
                  ref={(el) => {
                    scrollRefs.current[category.id] = el
                    if (el && !scrollStates[category.id]) {
                      checkScrollState(category.id)
                    }
                  }}
                  onScroll={() => checkScrollState(category.id)}
                  className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                  {categoryProducts.map((product) => {
                    const productImage = resolveImage(product)
                    
                    // Color schemes for different categories
                    const colorSchemes = {
                      'Industrial Supplies': {
                        bg: 'bg-gradient-to-br from-blue-50/60 via-white/95 to-blue-50/60',
                        border: 'border-blue-200/60',
                        accent: 'text-blue-700',
                        badge: 'bg-blue-500/10 text-blue-700 border-blue-300/70',
                      },
                      'Food & Agriculture': {
                        bg: 'bg-gradient-to-br from-emerald-50/60 via-white/95 to-emerald-50/60',
                        border: 'border-emerald-200/60',
                        accent: 'text-emerald-700',
                        badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-300/70',
                      },
                      'Health & Pharma': {
                        bg: 'bg-gradient-to-br from-rose-50/60 via-white/95 to-rose-50/60',
                        border: 'border-rose-200/60',
                        accent: 'text-rose-700',
                        badge: 'bg-rose-500/10 text-rose-700 border-rose-300/70',
                      },
                      'Textiles & Apparel': {
                        bg: 'bg-gradient-to-br from-purple-50/60 via-white/95 to-purple-50/60',
                        border: 'border-purple-200/60',
                        accent: 'text-purple-700',
                        badge: 'bg-purple-500/10 text-purple-700 border-purple-300/70',
                      },
                      Packaging: {
                        bg: 'bg-gradient-to-br from-amber-50/60 via-white/95 to-amber-50/60',
                        border: 'border-amber-200/60',
                        accent: 'text-amber-700',
                        badge: 'bg-amber-500/10 text-amber-700 border-amber-300/70',
                      },
                      Electronics: {
                        bg: 'bg-gradient-to-br from-indigo-50/60 via-white/95 to-indigo-50/60',
                        border: 'border-indigo-200/60',
                        accent: 'text-indigo-700',
                        badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-300/70',
                      },
                    }
                    const scheme = colorSchemes[category.name] || colorSchemes['Industrial Supplies']

                    return (
                      <div
                        key={product.id}
                        className={`group relative flex-shrink-0 w-[340px] overflow-hidden rounded-2xl border ${scheme.border} ${scheme.bg} backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer`}
                        onClick={() => navigate(`/buyer/products/${product.id}`)}
                      >
                        {/* Product Image Section */}
                        <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                          <img
                            src={productImage}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
                            }}
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                          
                          {/* Category Badge */}
                          <div className="absolute left-4 top-4">
                            <span className="inline-block rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                              {category.name}
                            </span>
                          </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-5 space-y-3">
                          {/* Seller Name */}
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                              {product.seller}
                            </p>
                            <p className="text-xs font-medium text-neutral-400">
                              {product.city}, {product.state}
                            </p>
                          </div>

                          {/* Product Name */}
                          <h3 className="text-lg font-bold leading-tight text-neutral-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {product.name}
                          </h3>

                          {/* Tagline / Description */}
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {product.shortDescription || 'Premium quality product ready for bulk orders'}
                          </p>

                          {/* Price Range & MOQ */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className={`rounded-full border ${scheme.badge} px-3 py-1 text-xs font-semibold`}>
                              ₹{product.priceMin.toLocaleString()} – ₹{product.priceMax.toLocaleString()}
                            </span>
                            <span className={`rounded-full border ${scheme.badge} px-3 py-1 text-[11px] font-semibold`}>
                              MOQ {product.moq.toLocaleString()}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              as={Link}
                              to={`/buyer/products/${product.id}`}
                              size="sm"
                              className="flex-1 justify-center text-xs font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View details
                            </Button>
                            <Button
                              as={Link}
                              to={`/buyer/rfq/${product.id}`}
                              size="sm"
                              variant="secondary"
                              className="text-xs font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              RFQ
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {scrollStates[category.id]?.canScrollLeft && (
                  <button
                    onClick={() => scrollCategory(category.id, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Scroll ${category.name} left`}
                  >
                    <ChevronLeft className="h-6 w-6 text-neutral-800 font-bold" strokeWidth={2.5} />
                  </button>
                )}
                {scrollStates[category.id]?.canScrollRight && (
                  <button
                    onClick={() => scrollCategory(category.id, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Scroll ${category.name} right`}
                  >
                    <ChevronRight className="h-6 w-6 text-neutral-800 font-bold" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70">
          <div className="py-12 text-center">
            <p className="text-lg font-semibold text-neutral-700">No products found</p>
            <p className="mt-2 text-sm text-neutral-500">
              {searchQuery ? 'Try adjusting your search query' : 'No products available in this category'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ProductListing
