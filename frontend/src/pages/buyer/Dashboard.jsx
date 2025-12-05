import { useNavigate } from 'react-router-dom'
import { Boxes, Users, PackageSearch, Inbox, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react'
import { useRef, useState, useEffect, useCallback } from 'react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import OptimizedImage from '../../components/common/OptimizedImage.jsx'
import { FALLBACK_IMAGES } from '../../constants/images.js'
import { getCategories } from '../../services/categoryService.js'
import { getBuyerDashboardSummary, getDashboardProducts } from '../../services/buyerService.js'

const Dashboard = () => {
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [metricsData, setMetricsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const categoryCarouselRef = useRef(null)
  const trendingCarouselRef = useRef(null)
  const autoScrollIntervalRef = useRef(null)
  const categoryAutoScrollRef = useRef(null)
  const trendingAutoScrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [categoryCanScrollLeft, setCategoryCanScrollLeft] = useState(false)
  const [categoryCanScrollRight, setCategoryCanScrollRight] = useState(true)
  const [categoryIsPaused, setCategoryIsPaused] = useState(false)
  const [trendingCanScrollLeft, setTrendingCanScrollLeft] = useState(false)
  const [trendingCanScrollRight, setTrendingCanScrollRight] = useState(true)
  const [trendingIsPaused, setTrendingIsPaused] = useState(false)

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400
      const currentScroll = carouselRef.current.scrollLeft
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      
      let newScrollLeft
      if (direction === 'left') {
        newScrollLeft = currentScroll - scrollAmount
        // If at the beginning, loop to the end
        if (newScrollLeft <= 0) {
          newScrollLeft = maxScroll
        }
      } else {
        newScrollLeft = currentScroll + scrollAmount
        // If at the end, loop to the beginning
        if (newScrollLeft >= maxScroll - 10) {
          newScrollLeft = 0
        }
      }
      
      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
      
      // Update scroll buttons state
      setTimeout(() => {
        if (carouselRef.current) {
          setCanScrollLeft(carouselRef.current.scrollLeft > 0)
          setCanScrollRight(
            carouselRef.current.scrollLeft < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
          )
        }
      }, 300)
    }
  }

  const checkScrollButtons = useCallback(() => {
    if (carouselRef.current) {
      setCanScrollLeft(carouselRef.current.scrollLeft > 0)
      setCanScrollRight(
        carouselRef.current.scrollLeft < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
      )
    }
  }, [])

  // Load buyer dashboard data from APIs on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [summary, categoriesData, productsData] = await Promise.all([
          getBuyerDashboardSummary(),
          getCategories(),
          getDashboardProducts({}),
        ])

        if (!isMounted) return

        setMetricsData(summary)
        
        // Normalize categories to have consistent id field
        const normalizedCategories = (categoriesData || []).map((cat) => ({
          id: cat._id || cat.id,
          _id: cat._id || cat.id,
          name: cat.name,
          description: cat.description,
          image: cat.image || null, // Image from first product in category
        }))

        // Show ALL categories in the horizontal scroller (no hard limit)
        setFeaturedCategories(normalizedCategories)

        const productsRaw = productsData || []

        // Normalise product shape coming from API so UI code is simple and robust
        const products = productsRaw.map((p) => ({
          id: p._id,
          name: p.name,
          priceMin: p.priceMin ?? 0,
          priceMax: p.priceMax ?? 0,
          moq: p.moq ?? 0,
          categoryId: p.category?._id,
          categoryName: p.category?.name || 'Product',
          gallery: Array.isArray(p.images) ? p.images : [],
        }))

        setRecentProducts(products.slice(0, 5))
        setTrendingProducts(products.slice(0, 6))
      } catch (err) {
        console.error('Failed to load buyer dashboard data:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard data.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Initialize scroll button states on mount
  useEffect(() => {
    checkScrollButtons()
    checkCategoryScrollButtons()
    checkTrendingScrollButtons()
    // Also check on window resize
    const handleResize = () => {
      setTimeout(checkScrollButtons, 100)
      setTimeout(checkCategoryScrollButtons, 100)
      setTimeout(checkTrendingScrollButtons, 100)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Category scroll functions
  const scrollCategoryCarousel = (direction) => {
    if (categoryCarouselRef.current) {
      const scrollAmount = 300
      const currentScroll = categoryCarouselRef.current.scrollLeft
      const maxScroll = categoryCarouselRef.current.scrollWidth - categoryCarouselRef.current.clientWidth
      
      let newScrollLeft
      if (direction === 'left') {
        newScrollLeft = Math.max(0, currentScroll - scrollAmount)
      } else {
        newScrollLeft = Math.min(maxScroll, currentScroll + scrollAmount)
      }
      
      categoryCarouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
      
      setTimeout(() => {
        checkCategoryScrollButtons()
      }, 300)
    }
  }

  const checkCategoryScrollButtons = useCallback(() => {
    if (categoryCarouselRef.current) {
      setCategoryCanScrollLeft(categoryCarouselRef.current.scrollLeft > 0)
      setCategoryCanScrollRight(
        categoryCarouselRef.current.scrollLeft < categoryCarouselRef.current.scrollWidth - categoryCarouselRef.current.clientWidth - 10
      )
    }
  }, [])

  const scrollTrendingCarousel = (direction) => {
    if (trendingCarouselRef.current) {
      const scrollAmount = 320
      const currentScroll = trendingCarouselRef.current.scrollLeft
      const maxScroll = trendingCarouselRef.current.scrollWidth - trendingCarouselRef.current.clientWidth

      let newScrollLeft
      if (direction === 'left') {
        newScrollLeft = Math.max(0, currentScroll - scrollAmount)
      } else {
        newScrollLeft = Math.min(maxScroll, currentScroll + scrollAmount)
      }

      trendingCarouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })

      setTimeout(() => {
        checkTrendingScrollButtons()
      }, 300)
    }
  }

  const checkTrendingScrollButtons = useCallback(() => {
    if (trendingCarouselRef.current) {
      setTrendingCanScrollLeft(trendingCarouselRef.current.scrollLeft > 0)
      setTrendingCanScrollRight(
        trendingCarouselRef.current.scrollLeft <
          trendingCarouselRef.current.scrollWidth - trendingCarouselRef.current.clientWidth - 10,
      )
    }
  }, [])

  // Category auto-scroll functionality
  useEffect(() => {
    if (categoryAutoScrollRef.current) {
      clearInterval(categoryAutoScrollRef.current)
    }

    if (!categoryIsPaused && categoryCarouselRef.current) {
      categoryAutoScrollRef.current = setInterval(() => {
        if (categoryCarouselRef.current) {
          const currentScroll = categoryCarouselRef.current.scrollLeft
          const maxScroll = categoryCarouselRef.current.scrollWidth - categoryCarouselRef.current.clientWidth
          const scrollAmount = 300

          if (currentScroll >= maxScroll - 10) {
            categoryCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            const newScrollLeft = Math.min(currentScroll + scrollAmount, maxScroll)
            categoryCarouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
          }

          setTimeout(() => {
            checkCategoryScrollButtons()
          }, 300)
          }
      }, 1500) // Auto-scroll every 1.5 seconds
    }

    return () => {
      if (categoryAutoScrollRef.current) {
        clearInterval(categoryAutoScrollRef.current)
      }
    }
  }, [categoryIsPaused, checkCategoryScrollButtons])

  // Trending auto-scroll functionality
  useEffect(() => {
    if (trendingAutoScrollRef.current) {
      clearInterval(trendingAutoScrollRef.current)
    }

    if (!trendingIsPaused && trendingCarouselRef.current) {
      trendingAutoScrollRef.current = setInterval(() => {
        if (trendingCarouselRef.current) {
          const currentScroll = trendingCarouselRef.current.scrollLeft
          const maxScroll =
            trendingCarouselRef.current.scrollWidth - trendingCarouselRef.current.clientWidth
          const scrollAmount = 320

          if (currentScroll >= maxScroll - 10) {
            trendingCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            const newScrollLeft = Math.min(currentScroll + scrollAmount, maxScroll)
            trendingCarouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
          }

          setTimeout(() => {
            checkTrendingScrollButtons()
          }, 300)
        }
      }, 1500)
    }

    return () => {
      if (trendingAutoScrollRef.current) {
        clearInterval(trendingAutoScrollRef.current)
      }
    }
  }, [trendingIsPaused, checkTrendingScrollButtons])

  // Auto-scroll functionality
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }

    // Only start auto-scroll if not paused
    if (!isPaused && carouselRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          const currentScroll = carouselRef.current.scrollLeft
          const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
          const scrollAmount = 400

          // Check if we're at the end
          if (currentScroll >= maxScroll - 10) {
            // Loop back to the beginning
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            // Scroll right
            const newScrollLeft = Math.min(currentScroll + scrollAmount, maxScroll)
            carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
          }

          // Update button states after scroll
          setTimeout(() => {
            checkScrollButtons()
          }, 300)
          }
      }, 1500) // Auto-scroll every 1.5 seconds
    }

    // Cleanup interval on unmount or when paused state changes
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [isPaused, checkScrollButtons])

  // Buyer-facing KPIs, now using API-driven metrics where available
  const metrics = [
    {
      label: 'Open RFQs',
      value: metricsData?.openRFQs ?? 0,
      helper: 'Requests awaiting supplier quotes',
      icon: Inbox,
      color: '#2563EB',
      gradient: 'from-blue-700/20 via-blue-400/15 to-blue-500/20',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-700/20',
      iconColor: 'text-blue-700',
      textColor: 'text-blue-700',
    },
    {
      label: 'Live products',
      value: metricsData?.productsCount ?? trendingProducts.length,
      helper: 'SKUs available to browse and shortlist',
      icon: PackageSearch,
      color: '#20B2AA',
      gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
      borderColor: 'border-teal-500',
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-700',
    },
    {
      label: 'Shortlisted products',
      value: recentProducts.length,
      helper: 'Saved SKUs for quick comparison',
      icon: Boxes,
      color: '#FFD700',
      gradient: 'from-yellow-500/20 via-yellow-400/15 to-yellow-500/20',
      borderColor: 'border-yellow-500',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Active categories',
      value: metricsData?.categoriesCount ?? featuredCategories.length,
      helper: 'Clusters you can browse today',
      icon: Users,
      color: '#2563EB',
      gradient: 'from-blue-500/20 via-blue-400/15 to-blue-500/20',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
  ]

  return (
    // Small horizontal padding inside buyer dashboard so left/right gaps look symmetrical
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-2 sm:px-3 lg:px-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className={`group relative overflow-hidden rounded-3xl border-2 ${metric.borderColor} bg-gradient-to-br ${metric.gradient} backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:scale-[1.02]`}
            >
              {/* Subtle glow effect */}
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${metric.gradient} opacity-30 blur-2xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl ${metric.iconBg} p-3 ${metric.iconColor} shadow-lg`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                
                <p className={`mt-4 sm:mt-5 text-3xl sm:text-4xl font-bold ${metric.textColor}`}>{metric.value}</p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-neutral-600">{metric.label}</p>
                <p className="mt-1.5 sm:mt-2 text-xs text-neutral-500">{metric.helper}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* Trending products moved just below KPIs for higher prominence */}
      <Card
        title="Trending Products"
        subtitle="What other buyers are actively shortlisting this week."
        className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        <div
          className="relative"
          onMouseEnter={() => setTrendingIsPaused(true)}
          onMouseLeave={() => setTrendingIsPaused(false)}
        >
          <div
            ref={trendingCarouselRef}
            onScroll={checkTrendingScrollButtons}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product) => {
              return (
                <button
                  key={product.id}
                  onClick={() => navigate(`/buyer/products/${product.id}`)}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[330px] aspect-[5/5] overflow-hidden rounded-3xl sm:rounded-4xl bg-white shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:scale-[1.02] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <OptimizedImage
                      src={product.gallery?.[0]}
                      alt={product.name}
                      fallback={FALLBACK_IMAGES.productCard}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                        Trending
                      </span>
                      <h3 className="mt-2 text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium text-emerald-100">
                        ₹{product.priceMin.toLocaleString()} – ₹{product.priceMax.toLocaleString()} · MOQ{' '}
                        {product.moq.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {trendingCanScrollLeft && (
            <button
              onClick={() => scrollTrendingCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll trending products left"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-800" />
            </button>
          )}
          {trendingCanScrollRight && (
            <button
              onClick={() => scrollTrendingCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll trending products right"
            >
              <ChevronRight className="h-5 w-5 text-neutral-800" />
            </button>
          )}
        </div>
      </Card>

      <Card
        title="Browse Categories"
        subtitle="Navigate by business function or commodity cluster."
        actions={
          <Button onClick={() => navigate('/buyer/categories')} variant="secondary" className="text-xs sm:text-sm">
            View All
          </Button>
        }
        className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/90 to-emerald-50/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(16,185,129,0.14)]"
      >
        <div 
          className="relative"
          onMouseEnter={() => setCategoryIsPaused(true)}
          onMouseLeave={() => setCategoryIsPaused(false)}
        >
          {/* Scrollable Category Grid */}
          <div
            ref={categoryCarouselRef}
            onScroll={checkCategoryScrollButtons}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredCategories.map((category) => {
              // Use category image from API (from first product in category) or null
              // Only show image if it exists and is a valid URL
              const categoryImage = category.image && category.image.trim() ? category.image.trim() : null
              
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/buyer/products?category=${category.id}`)}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[330px] aspect-[5/5] overflow-hidden rounded-3xl sm:rounded-4xl bg-white shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {/* Category Image */}
                  <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-200">
                    {categoryImage ? (
                      <OptimizedImage
                        src={categoryImage}
                        alt={category.name}
                        fallback={null}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 saturate-125 contrast-110 brightness-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          // Hide image on error, show gradient background instead
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                        <p className="text-sm font-semibold text-neutral-500">{category.name}</p>
                      </div>
                    )}
                    {/* Bottom gradient only — keeps most of image clear while text stays readable */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                    
                    {/* Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      {/* Soft backdrop directly behind text */}
                      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/40 via-black/5 to-transparent -z-10" />
                      <h3 className="text-lg font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] leading-snug">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-xs font-medium text-slate-100/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          {categoryCanScrollLeft && (
            <button
              onClick={() => scrollCategoryCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-800 font-bold" strokeWidth={2.5} />
            </button>
          )}
          {categoryCanScrollRight && (
            <button
              onClick={() => scrollCategoryCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-neutral-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)] hover:border-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-6 w-6 text-neutral-800 font-bold" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </Card>

      <Card
        title="Recently Shortlisted Products"
        subtitle="Quick reminders from your last visit."
        actions={
          <button
            onClick={() => navigate('/buyer/products')}
            className="group relative inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:from-blue-700 hover:via-blue-600 hover:to-teal-600 active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 overflow-hidden"
            aria-label="View all products"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">Go to Catalogue</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        }
        className="rounded-2xl sm:rounded-3xl border-2 border-teal-200/30 bg-gradient-to-br from-teal-50/50 via-white/80 to-yellow-50/50 backdrop-blur-xl shadow-[0_20px_60px_rgba(32,178,170,0.12)]"
      >
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            onScroll={checkScrollButtons}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentProducts.map((product, index) => {
              const categoryName = product.categoryName || 'Product'
              
              // Color schemes matching the image style
              const colorSchemes = [
                { 
                  bg: 'bg-gradient-to-br from-yellow-50/60 via-blue-50/40 to-yellow-50/60',
                  imageBg: 'bg-gradient-to-br from-yellow-100/30 via-blue-100/20 to-yellow-100/30',
                  accent: 'text-blue-700',
                  border: 'border-blue-200/40'
                },
                {
                  bg: 'bg-gradient-to-br from-pink-50/50 via-rose-50/40 to-pink-50/50',
                  imageBg: 'bg-gradient-to-br from-pink-100/30 via-rose-100/20 to-pink-100/30',
                  accent: 'text-rose-700',
                  border: 'border-rose-200/40'
                },
                {
                  bg: 'bg-gradient-to-br from-green-50/60 via-emerald-50/40 to-green-50/60',
                  imageBg: 'bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-green-100/30',
                  accent: 'text-emerald-700',
                  border: 'border-emerald-200/40'
                },
                {
                  bg: 'bg-gradient-to-br from-neutral-50/60 via-slate-50/40 to-neutral-50/60',
                  imageBg: 'bg-gradient-to-br from-neutral-100/30 via-slate-100/20 to-neutral-100/30',
                  accent: 'text-slate-700',
                  border: 'border-slate-200/40'
                },
                {
                  bg: 'bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-orange-50/60',
                  imageBg: 'bg-gradient-to-br from-orange-100/30 via-amber-100/20 to-orange-100/30',
                  accent: 'text-amber-700',
                  border: 'border-amber-200/40'
                },
              ]
              const scheme = colorSchemes[index % colorSchemes.length]
              
              return (
                <div
                  key={product.id}
                  className={`group relative flex-shrink-0 w-[320px] overflow-hidden rounded-4xl border ${scheme.border} ${scheme.bg} backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer`}
                  onClick={() => navigate(`/buyer/products/${product.id}`)}
                >
                  {/* Product Image Section */}
                  <div className={`relative h-64 w-full overflow-hidden ${scheme.imageBg}`}>
                    <OptimizedImage
                      src={product.gallery?.[0]}
                      alt={product.name}
                      fallback={FALLBACK_IMAGES.productCard}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-block rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                        {categoryName}
                      </span>
                    </div>
                  </div>

                  {/* Product Info Section - Minimal like Myntra (title + key price info) */}
                  <div className="p-5 space-y-3">
                    {/* Product Name */}
                    <h3 className="text-lg font-bold leading-tight text-neutral-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </h3>

                    {/* Minimal pricing row - consistent color across cards */}
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                        Price
                      </span>
                      <span className="text-lg font-bold text-neutral-900">
                        ₹{product.priceMin.toLocaleString()} – ₹{product.priceMax.toLocaleString()}
                      </span>
                    </div>

                    {/* Compact MOQ helper */}
                    <p className="text-[11px] font-medium text-neutral-500">
                      MOQ {product.moq.toLocaleString()} units
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-neutral-200 hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-neutral-200 hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-neutral-700" />
            </button>
          )}
        </div>
      </Card>

    </div>
  )
}

export default Dashboard

