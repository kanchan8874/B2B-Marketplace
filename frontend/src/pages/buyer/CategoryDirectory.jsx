import { useNavigate } from 'react-router-dom'
import CategoryGrid from '../../components/buyer/CategoryGrid.jsx'
import Button from '../../components/common/Button.jsx'
import { categories } from '../../mocks/categories.js'

const stats = [
  { label: 'Curated categories', value: categories.length },
  { label: 'Vetted suppliers', value: '380+' },
  { label: 'Ready RFQs', value: '140+' },
]

const CategoryDirectory = () => {
  const navigate = useNavigate()

  const handleSelect = (category) => {
    navigate(`/buyer/products?category=${category.id}`)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-white to-brand-primary/10 p-8 shadow-[0_30px_80px_rgba(15,98,254,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">Buyer workspace</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-neutral-900 lg:text-4xl">Categories directory</h1>
            <p className="text-sm text-neutral-600 lg:text-base">
              Navigate curated sourcing lanes built for enterprise procurement. Every tile is WCAG compliant with the right
              context to help you shortlist faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="/buyer/products" size="lg" className="px-6">
                Explore products
              </Button>
              <Button as="a" href="/buyer/rfqs" size="lg" variant="secondary" className="px-6">
                View RFQ center
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/70 bg-white/95 p-4 text-center shadow-[0_20px_50px_rgba(15,98,254,0.08)]"
              >
                <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_25px_70px_rgba(15,98,254,0.08)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Categories</h2>
            <p className="text-sm text-neutral-500">Tap any tile to view associated products and send RFQs.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/buyer/products')}>
            View all products
          </Button>
        </div>
        <CategoryGrid items={categories} onSelect={handleSelect} />
      </section>
    </div>
  )
}

export default CategoryDirectory
