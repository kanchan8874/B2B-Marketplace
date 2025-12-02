import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Crown, Package, AlertCircle, Users } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import Modal from '../../components/common/Modal.jsx'

// Mock data – in real app this will come from subscription + product APIs
const SUBSCRIPTION_CONFIG = {
  Silver: { limit: 5 },
  Gold: { limit: 20 },
  Platinum: { limit: 100 },
}

const sellersBySubscription = [
  {
    id: 's1',
    name: 'Nova Foods',
    email: 'karan@novafoods.com',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'Gold',
    productsUsed: 14,
    status: 'Active',
  },
  {
    id: 's2',
    name: 'Guardian Health',
    email: 'contact@guardianhealth.in',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'Platinum',
    productsUsed: 22,
    status: 'Active',
  },
  {
    id: 's3',
    name: 'PackAge Labs',
    email: 'sales@packagelabs.in',
    city: 'Ahmedabad',
    state: 'Gujarat',
    tier: 'Silver',
    productsUsed: 4,
    status: 'Active',
  },
  {
    id: 's4',
    name: 'Saffron Harvest Co.',
    email: 'info@saffronharvest.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'Silver',
    productsUsed: 5,
    status: 'Limit reached',
  },
]

const tierColors = {
  Silver: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  Gold: 'bg-amber-50 text-amber-800 border-amber-300',
  Platinum: 'bg-sky-50 text-sky-800 border-sky-300',
}

const SubscriptionKPI = ({ icon: Icon, label, value, helper, tone }) => {
  const toneMap = {
    primary: {
      border: 'border-blue-500',
      bg: 'from-blue-50 via-blue-25 to-blue-50',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    success: {
      border: 'border-emerald-500',
      bg: 'from-emerald-50 via-emerald-25 to-emerald-50',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    warning: {
      border: 'border-amber-500',
      bg: 'from-amber-50 via-amber-25 to-amber-50',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  }[tone]

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border-2 ${toneMap.border} bg-gradient-to-br ${toneMap.bg} p-6 shadow-[0_10px_30px_rgba(15,23,42,0.10)] min-h-[170px]`}
    >
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/60 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-700">{label}</p>
          <p className="mt-2 text-4xl font-bold text-neutral-900">{value}</p>
          <p className="mt-1 text-sm text-neutral-700">{helper}</p>
        </div>
        <div className={`rounded-2xl p-2.5 shadow-md ${toneMap.iconBg}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

const SubscriptionManagement = () => {
  const [planConfig, setPlanConfig] = useState(SUBSCRIPTION_CONFIG)
  const [searchParams] = useSearchParams()
  const initialSellerId = searchParams.get('sellerId') || sellersBySubscription[0]?.id
  const initialSeller = sellersBySubscription.find((s) => s.id === initialSellerId) || sellersBySubscription[0]
  const [selectedSellerId, setSelectedSellerId] = useState(initialSeller?.id)
  const [draftTier, setDraftTier] = useState(initialSeller?.tier || 'Silver')
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  const stats = useMemo(() => {
    const counts = { Silver: 0, Gold: 0, Platinum: 0 }
    let nearLimit = 0
    let atLimit = 0

    sellersBySubscription.forEach((seller) => {
      counts[seller.tier] += 1
      const limit = planConfig[seller.tier].limit
      const usage = seller.productsUsed / limit
      if (usage >= 1) atLimit += 1
      else if (usage >= 0.8) nearLimit += 1
    })

    return { counts, nearLimit, atLimit }
  }, [planConfig])

  const selectedSeller = sellersBySubscription.find((s) => s.id === selectedSellerId)
  const selectedLimit = selectedSeller ? planConfig[selectedSeller.tier].limit : 0

  const handleSelectSeller = (sellerId) => {
    const seller = sellersBySubscription.find((s) => s.id === sellerId)
    setSelectedSellerId(sellerId)
    setDraftTier(seller?.tier || 'Silver')
  }

  const handlePlanLimitChange = (tier, value) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed) || parsed <= 0) return
    setPlanConfig((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], limit: parsed },
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Subscription Management</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Monitor how many sellers are on each tier, adjust plan limits, and upgrade accounts as needed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            as={Link}
            to="/admin/subscriptions/sellers"
            size="sm"
            variant="ghost"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white/90 px-4 py-2 text-xs font-semibold text-neutral-800 shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:border-brand-secondary hover:text-brand-secondary hover:bg-blue-50/60"
          >
            <Users className="h-5 w-5 text-brand-secondary" />
            <span>Subscribed sellers</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsPlanModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 px-5 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.35)] hover:brightness-110"
          >
            <Crown className="h-5 w-5 text-white" />
            <span>Edit plans </span>
          </Button>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid gap-5 md:grid-cols-3 max-w-5xl ">
        <SubscriptionKPI
          icon={Crown}
          label="Silver sellers"
          value={stats.counts.Silver.toString()}
          helper={`Up to ${planConfig.Silver.limit} active listings per seller`}
          tone="primary"
        />
        
        <SubscriptionKPI
          icon={Package}
          label="Gold sellers"
          value={stats.counts.Gold.toString()}
          helper={`Up to ${planConfig.Gold.limit} active listings per seller`}
          tone="warning"
        />
        <SubscriptionKPI
          icon={AlertCircle}
          label="Platinum sellers"
          value={stats.counts.Platinum.toString()}
          helper={`Up to ${planConfig.Platinum.limit} active listings per seller`}
          tone="success"
        />
      </section>

      {/* Main content */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Sellers list */}
        <Card
          title="Sellers by subscription tier"
          subtitle={`Showing latest ${Math.min(
            5,
            sellersBySubscription.length,
          )} of ${sellersBySubscription.length} sellers. Open the full list for complete cohort details.`}
        >
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/60">
            <div className="grid grid-cols-[1.4fr,1.2fr,1.2fr,1.1fr,auto] border-b border-neutral-200 bg-neutral-100/60 px-4 py-2 text-xs font-semibold text-neutral-700">
              <span>Seller</span>
              <span>Tier</span>
              <span>Products</span>
              <span>Remaining slots</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y divide-neutral-200 bg-white">
              {sellersBySubscription.slice(0, 5).map((seller) => {
                const limit = planConfig[seller.tier].limit
                const remaining = Math.max(0, limit - seller.productsUsed)
                const usagePct = Math.min(100, Math.round((seller.productsUsed / limit) * 100))
                const isSelected = seller.id === selectedSellerId

                return (
                  <button
                    type="button"
                    key={seller.id}
                    onClick={() => handleSelectSeller(seller.id)}
                    className={`grid w-full grid-cols-[1.4fr,1.2fr,1.2fr,1.1fr,auto] items-center px-4 py-3 text-left text-xs transition-colors ${
                      isSelected ? 'bg-blue-50/80' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{seller.name}</p>
                      <p className="text-[11px] text-neutral-600">
                        {seller.city}, {seller.state}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${tierColors[seller.tier]}`}
                      >
                        {seller.tier}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-800">
                        {seller.productsUsed} / {limit}
                      </p>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-200">
                        <div
                          className={`h-full rounded-full ${
                            usagePct >= 100 ? 'bg-red-500' : usagePct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${usagePct}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          remaining === 0 ? 'text-red-600' : remaining <= 2 ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {remaining} slots left
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                        {seller.status}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button as={Link} to="/admin/subscriptions/sellers" variant="ghost" size="sm">
              View full sellers list →
            </Button>
          </div>
        </Card>

        {/* Edit panel */}
        <Card
          title="Edit subscription"
          subtitle={
            selectedSeller
              ? `Update tier and limits for ${selectedSeller.name}`
              : 'Select a seller from the list to edit their subscription.'
          }
          className="border border-neutral-200/80"
        >
          {selectedSeller ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm">
                <p className="font-medium text-neutral-900">{selectedSeller.name}</p>
                <p className="text-xs text-neutral-600">
                  {selectedSeller.city}, {selectedSeller.state} • {selectedSeller.email}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Choose tier</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {['Silver', 'Gold', 'Platinum'].map((tier) => {
                    const limit = planConfig[tier].limit
                    const isActive = draftTier === tier
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setDraftTier(tier)}
                        className={`flex flex-col rounded-2xl border px-3 py-2 text-left text-xs transition-colors ${
                          isActive
                            ? 'border-blue-500 bg-blue-50/80 text-blue-900'
                            : 'border-neutral-200 bg-white hover:border-blue-400 hover:bg-blue-50/60'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                          {tier} tier
                        </span>
                        <span className="mt-1 text-[11px] text-neutral-600">
                          Up to {limit} active product listings
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-neutral-50 px-4 py-3 text-xs">
                <p className="font-semibold text-neutral-800">Current usage</p>
                <p className="text-neutral-700">
                  {selectedSeller.productsUsed} of {selectedLimit} products used on the{' '}
                  <span className="font-semibold">{selectedSeller.tier}</span> tier.
                </p>
                <p className="text-neutral-600">
                  Changing the tier will adjust this seller&apos;s maximum listings immediately. No products will be
                  deleted; extra ones can be archived separately if needed.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
              Select a seller from the left to edit their subscription.
            </div>
          )}
        </Card>
      </section>

      {/* Plan configuration modal */}
      <Modal
        title="Plan configuration"
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsPlanModalOpen(false)}>
              Close
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-700">
          Adjust how many active product listings each tier allows. Changes affect all sellers on that tier.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {['Silver', 'Gold', 'Platinum'].map((tier) => (
            <div key={tier} className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold text-neutral-900">{tier} plan</p>
              </div>
              <label className="flex flex-col gap-1 text-xs text-neutral-700">
                Listings allowed
                <input
                  type="number"
                  min="1"
                  value={planConfig[tier].limit}
                  onChange={(e) => handlePlanLimitChange(tier, e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
              </label>
              <p className="text-[11px] text-neutral-600">
                Sellers on the {tier.toLowerCase()} plan can keep up to this many active product listings.
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default SubscriptionManagement


