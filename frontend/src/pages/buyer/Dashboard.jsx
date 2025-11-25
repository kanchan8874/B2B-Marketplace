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

  const metrics = [
    {
      label: 'Categories',
      value: categories.length,
      helper: 'Curated sourcing lanes',
      icon: Boxes,
    },
    {
      label: 'Active suppliers',
      value: 38,
      helper: 'Recently approved sellers',
      icon: Users,
    },
    {
      label: 'Products',
      value: products.length,
      helper: 'Ready for RFQ',
      icon: PackageSearch,
    },
    {
      label: 'Open RFQs',
      value: 4,
      helper: 'Awaiting response',
      icon: Inbox,
    },
  ]

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_22px_45px_rgba(15,98,254,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">{metric.label}</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-neutral-900">{metric.value}</p>
              <p className="text-sm text-neutral-500">{metric.helper}</p>
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
        className="rounded-[32px] border-white/70 bg-white/95 shadow-[0_20px_60px_rgba(15,98,254,0.08)]"
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
        className="rounded-[32px] border-white/70 bg-white/95 shadow-[0_20px_60px_rgba(15,98,254,0.08)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {recentProducts.map((product) => (
            <div key={product.id} className="rounded-2xl border border-surface-border/70 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-secondary">
                {categories.find((cat) => cat.id === product.categoryId)?.name}
              </p>
              <p className="mt-1 font-semibold text-neutral-900">{product.name}</p>
              <p className="text-neutral-500">₹{product.priceMin} – ₹{product.priceMax}</p>
              <Button
                as="a"
                href={`/buyer/products/${product.id}`}
                size="sm"
                variant="ghost"
                className="mt-3 px-0 text-brand-primary"
              >
                View details &rarr;
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

