import { useMemo } from 'react'
import { Package, Store, FileText, Inbox as InboxIcon } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import RFQList from '../../components/seller/RFQList.jsx'
import ProductStatusBadge from '../../components/seller/ProductStatusBadge.jsx'
import { products } from '../../mocks/products.js'
import { rfqs } from '../../mocks/rfqs.js'

const SellerDashboard = () => {
  const kpis = useMemo(
    () => [
      {
        label: 'Live products',
        value: products.length,
        helper: 'Approved items ready for buyers',
        icon: Package,
        gradient: 'from-blue-300/70 via-blue-100/55 to-blue-200/70',
        borderColor: 'border-blue-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-blue-700',
        textColor: 'text-blue-700',
      },
      {
        label: 'Pending approvals',
        value: 2,
        helper: 'Listings awaiting review',
        icon: Store,
        gradient: 'from-emerald-300/70 via-emerald-100/55 to-emerald-200/70',
        borderColor: 'border-emerald-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-700',
      },
      {
        label: 'Open RFQs',
        value: rfqs.length,
        helper: 'Buyers awaiting your response',
        icon: FileText,
        gradient: 'from-yellow-300/90 via-yellow-100/75 to-yellow-200/90',
        borderColor: 'border-yellow-400',
        iconBg: 'bg-white/20',
        iconColor: 'text-yellow-950',
        textColor: 'text-yellow-950',
      },
      {
        label: 'Responded this week',
        value: 3,
        helper: 'Keep momentum high',
        icon: InboxIcon,
        gradient: 'from-blue-300/75 via-blue-100/60 to-blue-200/85',
        borderColor: 'border-blue-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-blue-700',
        textColor: 'text-blue-700',
      },
    ],
    []
  )

  return (
    <div className="space-y-10">
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className={`group relative overflow-hidden rounded-3xl border-2 ${kpi.borderColor} bg-gradient-to-br ${kpi.gradient} backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:scale-[1.02]`}
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${kpi.gradient} opacity-30 blur-2xl`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl ${kpi.iconBg} p-3 ${kpi.iconColor} shadow-lg`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <p className={`mt-5 text-4xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-neutral-700">
                  {kpi.label}
                </p>
                <p className="mt-2 text-xs text-neutral-600">{kpi.helper}</p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] items-start">
        <Card
          title="Product performance"
          subtitle="Most active SKUs with current status."
          actions={
            <Button as="a" href="/seller/products/new">
              Add new product
            </Button>
          }
          className="flex h-full flex-col border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
        >
          <div className="flex-1 space-y-4">
            {products.slice(0, 4).map((product) => {
              const status = product.priceMin < 50 ? 'Pending' : 'Live'
              return (
                <article
                  key={product.id}
                  className="rounded-3xl border border-surface-border bg-white/95 p-4 shadow-subtle transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">SKU</p>
                      <h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.shortDescription}</p>
                    </div>
                    <ProductStatusBadge status={status} />
                  </div>
                  <dl className="mt-3 grid gap-3 text-xs text-neutral-600 sm:grid-cols-3">
                    <div>
                      <dt className="text-neutral-500">Price band</dt>
                      <dd className="font-semibold text-neutral-900">
                        ₹{product.priceMin} – ₹{product.priceMax}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">MOQ</dt>
                      <dd className="font-semibold text-neutral-900">{product.moq}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Category</dt>
                      <dd className="font-semibold text-neutral-900">{product.category}</dd>
                    </div>
                  </dl>
                </article>
              )
            })}
          </div>
        </Card>

        <Card
          title="RFQ inbox"
          subtitle="Latest buyer requests awaiting action."
          actions={
            <Button as="a" href="/seller/rfqs" variant="secondary" size="sm">
              View all
            </Button>
          }
          className="flex h-full flex-col border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-emerald-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.16)]"
        >
          <div className="flex-1 overflow-hidden">
            <RFQList items={rfqs.slice(0, 4)} />
          </div>
        </Card>
      </section>
    </div>
  )
}

export default SellerDashboard


