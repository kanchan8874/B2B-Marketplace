import { useNavigate } from 'react-router-dom'
import { Boxes, Users, PackageSearch, Inbox } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import CategoryGrid from '../../components/buyer/CategoryGrid.jsx'
import { categories } from '../../mocks/categories.js'
import { products } from '../../mocks/products.js'

const Dashboard = () => {
  const featuredCategories = categories.slice(0, 6)
  const recentProducts = products.slice(0, 4)
  const navigate = useNavigate()

  // M Logo Colors: Blue (#2563EB), Teal (#20B2AA), Gold (#FFD700)
  const metrics = [
    {
      label: 'Categories',
      value: categories.length,
      helper: 'Curated sourcing lanes',
      icon: Boxes,
      color: '#2563EB', // Blue
      gradient: 'from-blue-700/20 via-blue-400/15 to-blue-500/20',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-700/20',
      iconColor: 'text-blue-700',
      textColor: 'text-blue-700',
    },
    {
      label: 'Active suppliers',
      value: 38,
      helper: 'Recently approved sellers',
      icon: Users,
      color: '#20B2AA', // Teal
      gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
      borderColor: 'border-teal-500',
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-700',
    },
    {
      label: 'Products',
      value: products.length,
      helper: 'Ready for RFQ',
      icon: PackageSearch,
      color: '#FFD700', // Gold
      gradient: 'from-yellow-500/20 via-yellow-400/15 to-yellow-500/20',
      borderColor: 'border-yellow-500',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Open RFQs',
      value: 4,
      helper: 'Awaiting response',
      icon: Inbox,
      color: '#2563EB', // Blue (reusing for 4th card)
      gradient: 'from-blue-500/20 via-blue-400/15 to-blue-500/20',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
  ]

  return (
    <div className="space-y-10">
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
                
                <p className={`mt-5 text-4xl font-bold ${metric.textColor}`}>{metric.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-neutral-600">{metric.label}</p>
                <p className="mt-2 text-xs text-neutral-500">{metric.helper}</p>
              </div>
            </div>
          )
        })}
      </section>

      <Card
        title="Browse categories"
        subtitle="Navigate by business function or commodity cluster."
        actions={
          <Button as="a" href="/buyer/categories" variant="secondary">
            View all
          </Button>
        }
        className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/90 to-emerald-50/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(16,185,129,0.14)]"
      >
        <CategoryGrid
          items={featuredCategories}
          onSelect={(category) => navigate(`/buyer/products?category=${category.id}`)}
        />
      </Card>

      <Card
        title="Recently shortlisted products"
        subtitle="Quick reminders from your last visit."
        actions={
          <Button as="a" href="/buyer/products">
            Go to catalogue
          </Button>
        }
        className="rounded-3xl border-2 border-teal-200/30 bg-gradient-to-br from-teal-50/50 via-white/80 to-yellow-50/50 backdrop-blur-xl shadow-[0_20px_60px_rgba(32,178,170,0.12)]"
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {recentProducts.map((product, index) => {
            const colors = [
              { bg: 'bg-blue-50/40', text: 'text-blue-700', hoverText: 'text-blue-900' },
              { bg: 'bg-teal-50/40', text: 'text-teal-700', hoverText: 'text-teal-900' },
              { bg: 'bg-yellow-50/40', text: 'text-yellow-700', hoverText: 'text-yellow-900' },
              { bg: 'bg-blue-50/40', text: 'text-blue-700', hoverText: 'text-blue-900' },
            ]
            const colorScheme = colors[index % colors.length]
            
            return (
              <div
                key={product.id}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-300 ${colorScheme.bg} backdrop-blur-sm p-5 text-sm shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/90 hover:via-yellow-100/95 hover:to-yellow-400/100 hover:border-neutral-500 hover:shadow-[0_16px_50px_rgba(37,99,235,0.22)] hover:scale-[1.02]`}
              >
                {/* Category label */}
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-600 transition-all duration-300 group-hover:text-neutral-900/90 group-hover:font-bold">
                  {categories.find((cat) => cat.id === product.categoryId)?.name}
                </p>
                
                {/* Product name */}
                <p className="mt-2.5 text-base font-bold text-neutral-900 transition-all duration-300 group-hover:text-neutral-900 group-hover:font-extrabold group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                  {product.name}
                </p>
                
                {/* Price */}
                <p className="mt-2 text-sm font-semibold text-neutral-700 transition-all duration-300 group-hover:text-neutral-900 group-hover:font-bold group-hover:drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  ₹{product.priceMin} – ₹{product.priceMax}
                </p>
                
                {/* View details button */}
                <div className="mt-4">
                  <a
                    href={`/buyer/products/${product.id}`}
                    className={`inline-block text-xs font-semibold transition-none ${colorScheme.text} group-hover:text-neutral-900 group-hover:font-bold group-hover:underline group-hover:decoration-2 group-hover:decoration-neutral-900`}
                  >
                    View details &rarr;
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

