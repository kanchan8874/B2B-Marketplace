import { useNavigate } from 'react-router-dom'
import CategoryGrid from '../../components/buyer/CategoryGrid.jsx'
import Button from '../../components/common/Button.jsx'
import { categories } from '../../mocks/categories.js'

const stats = [
  { label: 'Curated categories', value: categories.length, tone: 'blue' },
  { label: 'Vetted suppliers', value: '380+', tone: 'teal' },
  { label: 'Ready RFQs', value: '140+', tone: 'gold' },
]

const CategoryDirectory = () => {
  const navigate = useNavigate()

  const handleSelect = (category) => {
    navigate(`/buyer/products?category=${category.id}`)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 p-8 shadow-[0_30px_80px_rgba(37,99,235,0.14)]">
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
            {stats.map((stat) => {
              const toneClasses =
                stat.tone === 'blue'
                  ? {
                      border: 'border-blue-200/70',
                      bg: 'from-blue-500/5 via-white/90 to-blue-500/5',
                      value: 'text-blue-700',
                    }
                  : stat.tone === 'teal'
                    ? {
                        border: 'border-teal-200/70',
                        bg: 'from-teal-500/5 via-white/90 to-teal-500/5',
                        value: 'text-teal-700',
                      }
                    : {
                        border: 'border-yellow-200/70',
                        bg: 'from-yellow-400/8 via-white/92 to-yellow-400/8',
                        value: 'text-yellow-700',
                      }

              return (
                <div
                  key={stat.label}
                  className={`group rounded-3xl border bg-gradient-to-br ${toneClasses.bg} p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_22px_60px_rgba(0,0,0,0.12)] hover:scale-[1.02] ${toneClasses.border}`}
                >
                  <p className={`text-2xl font-semibold ${toneClasses.value}`}>{stat.value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-600">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-emerald-50/70 p-6 shadow-[0_25px_70px_rgba(16,185,129,0.18)]">
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
