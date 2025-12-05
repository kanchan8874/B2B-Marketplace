import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Store, FileText, Inbox as InboxIcon } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductStatusBadge from '../../components/seller/ProductStatusBadge.jsx'
import SubscriptionTierCard from '../../components/seller/SubscriptionTierCard.jsx'
import { listRFQs } from '../../services/rfqService.js'
import { listProducts } from '../../services/productService.js'
import { useAuth } from '../../hooks/useAuth.js'

const SellerDashboard = () => {
  const { user } = useAuth()
  const [rfqs, setRfqs] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [rfqData, productData] = await Promise.all([
          listRFQs(),
          listProducts({ seller: user?.id, includeAuth: true }),
        ])
        if (!isMounted) return
        setRfqs(rfqData || [])
        setProducts(productData || [])
      } catch (err) {
        console.error('Failed to load seller dashboard data:', err)
        if (isMounted) setError(err.message || 'Failed to load dashboard data.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (user?.id) {
      load()
    }

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const kpis = useMemo(() => {
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

    const rfqsLast30 = rfqs.filter((rfq) => {
      const created = rfq.createdAt ? new Date(rfq.createdAt).getTime() : 0
      return created >= thirtyDaysAgo
    })

    const receivedCount = rfqsLast30.length
    const quotedCount = rfqs.filter((r) => r.status === 'Quoted' || r.status === 'Accepted').length
    const acceptedCount = rfqs.filter((r) => r.status === 'Accepted').length
    const totalDecided = rfqs.filter(
      (r) => r.status === 'Accepted' || r.status === 'Declined',
    ).length
    const winRate =
      totalDecided > 0 ? `${Math.round((acceptedCount / totalDecided) * 100)}%` : '—'

    return [
      {
        label: 'RFQs Received (30 Days)',
        value: receivedCount,
        helper: 'Inbound demand from buyers',
        icon: Package,
        gradient: 'from-blue-300/70 via-blue-100/55 to-blue-200/70',
        borderColor: 'border-blue-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-blue-700',
        textColor: 'text-blue-700',
      },
      {
        label: 'Quotes Sent',
        value: quotedCount,
        helper: 'Responses shared with buyers',
        icon: Store,
        gradient: 'from-emerald-300/70 via-emerald-100/55 to-emerald-200/70',
        borderColor: 'border-emerald-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-700',
      },
      {
        label: 'Win Rate',
        value: winRate,
        helper: 'Accepted vs declined RFQs',
        icon: FileText,
        gradient: 'from-yellow-300/90 via-yellow-100/75 to-yellow-200/90',
        borderColor: 'border-yellow-400',
        iconBg: 'bg-white/20',
        iconColor: 'text-yellow-950',
        textColor: 'text-yellow-950',
      },
      {
        label: 'Open RFQs',
        value: rfqs.filter((r) => r.status === 'Pending Response').length,
        helper: 'Awaiting your quote',
        icon: InboxIcon,
        gradient: 'from-blue-300/75 via-blue-100/60 to-blue-200/85',
        borderColor: 'border-blue-500',
        iconBg: 'bg-white/15',
        iconColor: 'text-blue-700',
        textColor: 'text-blue-700',
      },
    ]
  }, [rfqs])

  const pendingRFQs = useMemo(
    () => rfqs.filter((rfq) => rfq.status === 'Pending Response'),
    [rfqs],
  )

  const rfqsNeedingAction = useMemo(() => {
    if (pendingRFQs.length >= 3) {
      return pendingRFQs.slice(0, 3)
    }
    return [...pendingRFQs, ...rfqs.filter((rfq) => rfq.status !== 'Pending Response')].slice(0, 3)
  }, [pendingRFQs, rfqs])

  const topProducts = useMemo(
    () => products.slice(0, 4),
    [products],
  )

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 ${kpi.borderColor} bg-gradient-to-br ${kpi.gradient} backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:scale-[1.02]`}
            >
              <div className={`absolute -right-6 sm:-right-8 -top-6 sm:-top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br ${kpi.gradient} opacity-30 blur-2xl`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl sm:rounded-2xl ${kpi.iconBg} p-2 sm:p-2.5 lg:p-3 ${kpi.iconColor} shadow-lg`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                </div>

                <p className={`mt-4 sm:mt-5 text-3xl sm:text-4xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-neutral-700">
                  {kpi.label}
                </p>
                <p className="mt-1.5 sm:mt-2 text-xs text-neutral-600">{kpi.helper}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* Subscription Tier Card */}
      <SubscriptionTierCard />

      <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] items-start" aria-label="RFQs and product performance">
        <Card
          title="RFQs Needing Action"
          subtitle="Pending buyer requests that are waiting for your quote."
          actions={
            <Button as={Link} to="/seller/rfqs" className="text-xs sm:text-sm">
              View RFQ Inbox
            </Button>
          }
          className="flex h-full flex-col border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)] rounded-2xl sm:rounded-3xl"
        >
          <div className="flex-1 space-y-3 sm:space-y-4">
            {loading ? (
              <p className="text-xs text-neutral-500" aria-live="polite">Loading RFQs...</p>
            ) : rfqsNeedingAction.length === 0 ? (
              <p className="text-xs text-neutral-500">
                Great work — you don&apos;t have any RFQs waiting for a response right now.
              </p>
            ) : (
              rfqsNeedingAction.map((rfqItem) => (
                <article
                  key={rfqItem._id}
                  className="rounded-2xl sm:rounded-3xl border border-surface-border bg-white/95 p-3 sm:p-4 shadow-subtle transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                        {rfqItem.buyer?.name || rfqItem.buyer?.companyName || 'Buyer'}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-neutral-900">
                        {rfqItem.product?.name || 'Product'}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {rfqItem.quantity?.toLocaleString?.() ?? '-'} units ·{' '}
                        {[rfqItem.deliveryLocation?.city, rfqItem.deliveryLocation?.state]
                          .filter(Boolean)
                          .join(', ') || 'Location N/A'}
                      </p>
                    </div>
                    <ProductStatusBadge
                      status={rfqItem.status === 'Pending Response' ? 'Pending' : 'Live'}
                    />
                  </div>
                  <dl className="mt-3 grid gap-2 sm:gap-3 text-xs text-neutral-600 grid-cols-1 sm:grid-cols-3">
                    <div>
                      <dt className="text-neutral-500">RFQ ID</dt>
                      <dd className="font-mono text-neutral-900 break-all">{rfqItem._id}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Received</dt>
                      <dd className="font-semibold text-neutral-900">
                        {rfqItem.createdAt
                          ? new Date(rfqItem.createdAt).toLocaleDateString()
                          : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Expires In</dt>
                      <dd className="font-semibold text-neutral-900">
                        {rfqItem.expiresAt
                          ? new Date(rfqItem.expiresAt).toLocaleDateString()
                          : '—'}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex justify-end">
                    <Button
                      as={Link}
                      to={`/seller/rfqs/${rfqItem._id}/respond`}
                      size="sm"
                      className="rounded-full px-3 sm:px-4 text-xs font-semibold"
                      aria-label={`Respond to RFQ ${rfqItem._id}`}
                    >
                      Respond Now
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>

        <Card
          title="Product Performance"
          subtitle="Most active SKUs with current status."
          actions={
            <Button as={Link} to="/seller/products/new" className="text-xs sm:text-sm">
              Add New Product
            </Button>
          }
          className="flex h-full flex-col border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-emerald-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.16)] rounded-2xl sm:rounded-3xl"
        >
          <div className="flex-1 space-y-3 sm:space-y-4">
            {loading ? (
              <p className="text-xs text-neutral-500" aria-live="polite">Loading products...</p>
            ) : topProducts.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No products yet. Add your first SKU to see performance here.
              </p>
            ) : (
              topProducts.map((product) => (
                <article
                  key={product._id}
                  className="rounded-2xl sm:rounded-3xl border border-surface-border bg-white/95 p-3 sm:p-4 shadow-subtle transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">SKU</p>
                      <h3 className="mt-1 text-sm font-semibold text-neutral-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                        {product.shortDescription}
                      </p>
                    </div>
                    <ProductStatusBadge status={product.status || 'Pending'} />
                  </div>
                  <dl className="mt-3 grid gap-2 sm:gap-3 text-xs text-neutral-600 grid-cols-1 sm:grid-cols-3">
                    <div>
                      <dt className="text-neutral-500">Price Band</dt>
                      <dd className="font-semibold text-neutral-900">
                        ₹{product.priceMin?.toLocaleString?.() ?? '-'} –{' '}
                        {product.priceMax?.toLocaleString?.() ?? '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">MOQ</dt>
                      <dd className="font-semibold text-neutral-900">
                        {product.moq?.toLocaleString?.() ?? '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Category</dt>
                      <dd className="font-semibold text-neutral-900">
                        {product.category?.name || '—'}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}

export default SellerDashboard


