import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'

// NOTE: In real implementation, this data will come from an admin subscription API.
// For now, keep a lightweight local copy of tier limits so the UI can render.
const SUBSCRIPTION_TIERS = {
  Silver: { productLimit: 5 },
  Gold: { productLimit: 20 },
  Platinum: { productLimit: 100 },
}

// Temporary mock list – keep structure similar to SubscriptionManagement
const sellers = [
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

const SubscriptionSellers = () => {
  const [tierFilter, setTierFilter] = useState('All')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    return sellers.filter((seller) => {
      if (tierFilter !== 'All' && seller.tier !== tierFilter) return false
      if (!search) return true
      const term = search.toLowerCase()
      return seller.name.toLowerCase().includes(term) || seller.email.toLowerCase().includes(term)
    })
  }, [tierFilter, search])

  const columns = [
    {
      header: 'Seller',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-medium text-neutral-900">{row.name}</p>
          <p className="text-xs text-neutral-600">
            {row.city}, {row.state}
          </p>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Tier',
      accessor: 'tier',
      cell: (row) => (
        <span className="inline-flex rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-xs font-semibold text-neutral-700">
          {row.tier}
        </span>
      ),
    },
    {
      header: 'Listings used',
      accessor: 'productsUsed',
      cell: (row) => {
        const limit = SUBSCRIPTION_TIERS[row.tier]?.productLimit || 0
        const pct = Math.min(100, Math.round((row.productsUsed / limit) * 100))
        return (
          <div>
            <p className="text-xs text-neutral-800">
              {row.productsUsed} / {limit}
            </p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-200">
              <div
                className={`h-full rounded-full ${
                  pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <StatusTag tone={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</StatusTag>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <Button as={Link} to={`/admin/subscriptions?sellerId=${row.id}`} size="sm" variant="ghost" className="text-xs">
          Manage subscription
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">All subscription sellers</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Browse every seller by subscription tier. Use filters to focus on Silver, Gold or Platinum cohorts.
          </p>
        </div>
      </section>

      <Card
        title="Sellers"
        subtitle="Search and filter by tier. Use Manage subscription to open the detailed edit view for a seller."
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-700">Filter by tier:</span>
            {['All', 'Silver', 'Gold', 'Platinum'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                className={`rounded-full px-3 py-1 ${
                  tierFilter === tier
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by seller or email..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 shadow-sm focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary sm:w-64"
            />
          </div>
        </div>
        <DataTable columns={columns} data={rows} />
      </Card>
    </div>
  )
}

export default SubscriptionSellers


