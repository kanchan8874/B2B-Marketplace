import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Store, Package, AlertCircle, FileText, TrendingUp } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import { getAdminDashboardSummary, listAdminUsers, listPendingProductsAdmin, listRFQsAdmin } from '../../services/adminService.js'
import { getPendingSellerKYCs, getPendingBuyerKYCs } from '../../services/kycService.js'

// Helper components & columns use dynamic data loaded from APIs
const KPICard = ({ icon: Icon, label, value, helper, gradient, borderColor, iconBg, iconColor, textColor }) => (
  <div
    className={`group relative overflow-hidden rounded-3xl border-2 ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-xl p-5 shadow-[0_10px_36px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_14px_50px_rgba(0,0,0,0.16)] hover:scale-[1.01]`}
  >
    {/* Subtle glow */}
    <div className={`absolute -right-7 -top-7 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-30 blur-2xl`} />

    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className={`rounded-2xl ${iconBg} p-2.5 ${iconColor} shadow-lg`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <p className={`mt-4 text-4xl font-bold ${textColor}`}>{value}</p>
      <p className="mt-1 text-lg font-semibold text-neutral-900">{label}</p>
      <p className="mt-1 text-sm text-neutral-800">{helper}</p>
    </div>
  </div>
)

const columnsBuyers = [
  { header: 'Buyer Name', accessor: 'name' },
  { header: 'Contact Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone="success">{row.status}</StatusTag>,
  },
]

const columnsSellers = [
  { header: 'Seller Name', accessor: 'name' },
  { header: 'Contact Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <div className="flex items-center gap-3">
        <StatusTag tone={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</StatusTag>
        {row.status === 'Pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" className="h-7 px-3 text-xs">
              Approve
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
              Reject
            </Button>
          </div>
        )}
        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
          Block
        </Button>
      </div>
    ),
  },
]

const columnsProducts = [
  { header: 'Product Name', accessor: 'name' },
  { header: 'Seller', accessor: 'seller' },
  { header: 'Category', accessor: 'category' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <div className="flex items-center gap-3">
        <StatusTag tone={row.status === 'Live' ? 'success' : 'warning'}>{row.status}</StatusTag>
        {row.status === 'Pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" className="h-7 px-3 text-xs">
              Approve
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
              Reject
            </Button>
          </div>
        )}
      </div>
    ),
  },
]

const columnsRFQ = [
  { header: 'RFQ ID', accessor: 'id' },
  { header: 'Product', accessor: 'product' },
  { header: 'Buyer', accessor: 'buyer' },
  { header: 'Seller', accessor: 'seller' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <StatusTag tone={row.status === 'Responded' ? 'success' : 'warning'}>{row.status}</StatusTag>
    ),
  },
  { header: 'Created', accessor: 'created' },
]

const columnsSellerKYC = [
  { header: 'Seller name', accessor: 'name' },
  { header: 'Contact email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'submitted',
    cell: (row) => <span className="text-xs text-neutral-600">Submitted {row.submitted}</span>,
  },
]

const columnsBuyerKYC = [
  { header: 'Buyer name', accessor: 'name' },
  { header: 'Contact email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'submitted',
    cell: (row) => <span className="text-xs text-neutral-600">Submitted {row.submitted}</span>,
  },
]

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ totalProducts: 0, pendingProducts: 0, totalRFQs: 0 })
  const [buyers, setBuyers] = useState([])
  const [sellers, setSellers] = useState([])
  const [products, setProducts] = useState([])
  const [rfqs, setRfqs] = useState([])
  const [sellerKYCQueue, setSellerKYCQueue] = useState([])
  const [buyerKYCQueue, setBuyerKYCQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          summaryData,
          buyersData,
          sellersData,
          pendingProductsData,
          rfqsData,
          sellerKYCData,
          buyerKYCData,
        ] = await Promise.all([
          getAdminDashboardSummary(),
          listAdminUsers({ role: 'buyer' }),
          listAdminUsers({ role: 'seller' }),
          listPendingProductsAdmin(),
          listRFQsAdmin(),
          // Use 'All' so dashboard always shows latest KYC activity (not only Pending)
          getPendingSellerKYCs('All', 1, 5),
          getPendingBuyerKYCs('All', 1, 5),
        ])

        if (!isMounted) return

        console.log('[AdminDashboard] API responses:', {
          summaryData,
          buyersData,
          sellersData,
          pendingProductsData,
          rfqsData,
          sellerKYCData,
          buyerKYCData,
        })

        setSummary(summaryData || {})
        setBuyers(Array.isArray(buyersData) ? buyersData : [])
        setSellers(Array.isArray(sellersData) ? sellersData : [])
        setProducts(Array.isArray(pendingProductsData) ? pendingProductsData : [])
        setRfqs(Array.isArray(rfqsData) ? rfqsData : [])

        // KYC data structure: { success, message, data: { kycs: [...], pagination: {...} } }
        const rawSellerKYCs = sellerKYCData?.data?.kycs || sellerKYCData?.kycs || []
        const rawBuyerKYCs = buyerKYCData?.data?.kycs || buyerKYCData?.kycs || []

        console.log('[AdminDashboard] Seller KYC data:', { sellerKYCData, rawSellerKYCs })
        console.log('[AdminDashboard] Buyer KYC data:', { buyerKYCData, rawBuyerKYCs })

        const normalizedSellerKYC = Array.isArray(rawSellerKYCs)
          ? rawSellerKYCs.map((kyc) => ({
              id: kyc._id,
              name: kyc.businessName || kyc.seller?.companyName || kyc.seller?.name || '—',
              contact: kyc.seller?.email || kyc.email || '—',
              city: kyc.city || '',
              state: kyc.state || '',
              submitted: kyc.createdAt ? new Date(kyc.createdAt).toLocaleDateString() : '—',
              status: kyc.status || 'Pending',
            }))
          : []

        const normalizedBuyerKYC = Array.isArray(rawBuyerKYCs)
          ? rawBuyerKYCs.map((kyc) => ({
              id: kyc._id,
              name: kyc.businessName || kyc.buyer?.companyName || kyc.buyer?.name || '—',
              contact: kyc.buyer?.email || kyc.email || '—',
              city: kyc.city || '',
              state: kyc.state || '',
              submitted: kyc.createdAt ? new Date(kyc.createdAt).toLocaleDateString() : '—',
              status: kyc.status || 'Pending',
            }))
          : []

        setSellerKYCQueue(normalizedSellerKYC)
        setBuyerKYCQueue(normalizedBuyerKYC)
      } catch (err) {
        console.error('[AdminDashboard] Failed to load admin dashboard data:', err)
        console.error('[AdminDashboard] Error details:', {
          message: err.message,
          stack: err.stack,
          response: err.response,
        })
        if (isMounted) {
          setError(err.message || 'Failed to load admin dashboard.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const kpis = useMemo(
    () => [
      {
        icon: Users,
        label: 'Total Buyers',
        value: buyers.length.toLocaleString(),
        helper: 'All active accounts',
        gradient: 'from-blue-700/20 via-blue-400/15 to-blue-500/20',
        borderColor: 'border-blue-500',
        iconBg: 'bg-blue-700/20',
        iconColor: 'text-blue-700',
        textColor: 'text-blue-700',
      },
      {
        icon: Store,
        label: 'Total Sellers',
        value: sellers.length.toLocaleString(),
        helper: `${sellers.filter((s) => s.isApproved === false).length} pending approvals`,
        gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
        borderColor: 'border-teal-500',
        iconBg: 'bg-teal-500/20',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700',
      },
      {
        icon: Package,
        label: 'Total Products',
        value: (summary.totalProducts || 0).toLocaleString(),
        helper: 'All SKUs in catalogue',
        gradient: 'from-yellow-500/20 via-yellow-400/15 to-yellow-500/20',
        borderColor: 'border-yellow-500',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-700',
      },
      {
        icon: AlertCircle,
        label: 'Pending Approvals',
        value: (summary.pendingProducts || 0).toString(),
        helper: 'Products awaiting review',
        gradient: 'from-blue-500/20 via-blue-400/15 to-blue-500/20',
        borderColor: 'border-blue-500',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700',
      },
      {
        icon: FileText,
        label: 'Total RFQs',
        value: rfqs.length.toLocaleString(),
        helper: `${rfqs.filter((r) => r.status === 'Pending Response').length} awaiting reply`,
        gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
        borderColor: 'border-teal-500',
        iconBg: 'bg-teal-500/20',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700',
      },
    ],
    [buyers, sellers, summary, rfqs]
  )

  const kpisSecondary = useMemo(() => {
    const pendingSellerApprovals = sellers.filter((s) => s.isApproved === false).length
    const awaitingRFQs = rfqs.filter((r) => r.status === 'Pending Response').length
    const respondedRFQs = rfqs.filter((r) => r.status === 'Quoted' || r.status === 'Accepted').length
    const liveProducts = (summary.totalProducts || 0) - (summary.pendingProducts || 0)
    const pendingSellerKYCs = sellerKYCQueue.filter((k) => k.status === 'Pending').length
    const pendingBuyerKYCs = buyerKYCQueue.filter((k) => k.status === 'Pending').length
    const blockedAccounts =
      buyers.filter((b) => b.isActive === false).length + sellers.filter((s) => s.isActive === false).length

    return [
      {
        icon: Store,
        label: 'Seller approvals pending',
        value: pendingSellerApprovals.toString(),
        helper: 'Sellers awaiting user approval',
        gradient: 'from-indigo-500/20 via-indigo-400/15 to-indigo-500/20',
        borderColor: 'border-indigo-500',
        iconBg: 'bg-indigo-500/20',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700',
      },
      {
        icon: FileText,
        label: 'RFQs awaiting response',
        value: awaitingRFQs.toString(),
        helper: 'Need seller quote',
        gradient: 'from-emerald-500/20 via-teal-400/15 to-emerald-500/20',
        borderColor: 'border-emerald-500',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-600',
        textColor: 'text-emerald-700',
      },
      {
        icon: FileText,
        label: 'RFQs responded',
        value: respondedRFQs.toString(),
        helper: 'Quotes already sent',
        gradient: 'from-sky-500/20 via-sky-400/15 to-sky-500/20',
        borderColor: 'border-sky-500',
        iconBg: 'bg-sky-500/20',
        iconColor: 'text-sky-600',
        textColor: 'text-sky-700',
      },
      {
        icon: Package,
        label: 'Live products',
        value: liveProducts.toString(),
        helper: `of ${products.length} total`,
        gradient: 'from-lime-500/20 via-lime-400/15 to-lime-500/20',
        borderColor: 'border-lime-500',
        iconBg: 'bg-lime-500/20',
        iconColor: 'text-lime-700',
        textColor: 'text-lime-700',
      },
      {
        icon: Users,
        label: 'KYC pending',
        value: (pendingSellerKYCs + pendingBuyerKYCs).toString(),
        helper: `${pendingSellerKYCs} seller • ${pendingBuyerKYCs} buyer`,
        gradient: 'from-amber-500/20 via-amber-400/15 to-amber-500/20',
        borderColor: 'border-amber-500',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-700',
      },
      {
        icon: Users,
        label: 'Blocked accounts',
        value: blockedAccounts.toString(),
        helper: 'Monitoring risk & abuse',
        gradient: 'from-rose-500/20 via-rose-400/15 to-rose-500/20',
        borderColor: 'border-red-700',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-700',
      },
    ]
  }, [buyers, sellers, rfqs, summary, products, sellerKYCQueue, buyerKYCQueue])

  const pendingProducts = useMemo(() => products, [products])

  return (
    <div className="space-y-8">
      {/* KPI Overview Cards */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">Overview Metrics</h2>
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        <div className="rounded-3xl border border-neutral-300/80 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="h-32 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-50"
                  />
                ))
              : kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
          </div>

          {/* Secondary KPI row */}
          {!loading && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {kpisSecondary.map((kpi) => (
                <KPICard key={kpi.label} {...kpi} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* KYC queues section (replaces User Management lists) */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">KYC queues</h2>
          <div className="flex gap-3">
            <Button as={Link} to="/admin/kyc/sellers" variant="ghost" size="sm">
              Open Seller KYC
            </Button>
            <Button as={Link} to="/admin/kyc/buyers" variant="ghost" size="sm">
              Open Buyer KYC
            </Button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Seller KYC queue"
            subtitle={`Showing latest ${Math.min(5, sellerKYCQueue.length)} of ${sellerKYCQueue.length} seller KYC submissions`}
            className="border border-amber-200/70"
          >
            <div className="max-h-64 overflow-y-auto pr-1">
              <DataTable columns={columnsSellerKYC} data={sellerKYCQueue.slice(0, 5)} />
            </div>
            <div className="mt-4 text-center">
              <Button as={Link} to="/admin/kyc/sellers" variant="ghost" size="sm">
                View full seller queue →
              </Button>
            </div>
          </Card>
          <Card
            title="Buyer KYC queue"
            subtitle={`Showing latest ${Math.min(5, buyerKYCQueue.length)} of ${buyerKYCQueue.length} buyer KYC submissions`}
            className="border border-sky-200/70"
          >
            <div className="max-h-64 overflow-y-auto pr-1">
              <DataTable columns={columnsBuyerKYC} data={buyerKYCQueue.slice(0, 5)} />
            </div>
            <div className="mt-4 text-center">
              <Button as={Link} to="/admin/kyc/buyers" variant="ghost" size="sm">
                View full buyer queue →
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Product approvals Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Product approvals</h2>
          <Button as={Link} to="/admin/products" variant="ghost" size="sm">
            Open Products Management
          </Button>
        </div>
        <Card
          title="Pending approval products"
          subtitle={`Showing latest ${Math.min(5, pendingProducts.length)} of ${pendingProducts.length} products awaiting review`}
          className="border-2 border-status-warning/20"
        >
          <DataTable columns={columnsProducts} data={pendingProducts.slice(0, 5)} />
          {pendingProducts.length === 0 && (
            <div className="py-8 text-center text-sm text-neutral-500">No pending approvals</div>
          )}
        </Card>
      </section>

      {/* RFQs needing action Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">RFQs needing action</h2>
          <Button as={Link} to="/admin/rfqs" variant="ghost" size="sm">
            Open RFQ Monitor
          </Button>
        </div>
        <Card
          title="Open RFQs awaiting response"
          subtitle={`Showing latest ${Math.min(
            5,
            rfqs.filter((r) => r.status === 'Awaiting response').length
          )} RFQs waiting for seller quotes`}
        >
          <DataTable
            columns={columnsRFQ}
            data={rfqs
              .filter((r) => r.status === 'Awaiting response')
              .slice(0, 5)}
          />
        </Card>
      </section>
    </div>
  )
}

export default AdminDashboard

