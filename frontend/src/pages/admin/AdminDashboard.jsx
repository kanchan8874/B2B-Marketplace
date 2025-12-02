import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Store, Package, AlertCircle, FileText, TrendingUp } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'

// Mock data - in real app, this would come from API
const buyers = [
  { id: 'b1', name: 'Fresh Basket Retail', contact: 'riya@freshbasket.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
  { id: 'b2', name: 'Pulse Hospitals', contact: 'ops@pulsehospitals.in', city: 'Hyderabad', state: 'Telangana', status: 'Active' },
  { id: 'b3', name: 'PackMart Solutions', contact: 'contact@packmart.in', city: 'Delhi', state: 'Delhi', status: 'Active' },
]

const sellers = [
  { id: 's1', name: 'Nova Foods', contact: 'karan@novafoods.com', city: 'Pune', state: 'Maharashtra', status: 'Pending' },
  { id: 's2', name: 'Guardian Health', contact: 'contact@guardianhealth.in', city: 'Pune', state: 'Maharashtra', status: 'Active' },
  { id: 's3', name: 'Saffron Harvest Co.', contact: 'info@saffronharvest.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
  { id: 's4', name: 'PackAge Labs', contact: 'sales@packagelabs.in', city: 'Ahmedabad', state: 'Gujarat', status: 'Pending' },
]

const products = [
  { id: 'p1', name: 'Cold-Pressed Cooking Oil', seller: 'Saffron Harvest Co.', status: 'Live', category: 'Food & Agriculture' },
  { id: 'p2', name: 'N95 Medical Respirators', seller: 'Guardian Health', status: 'Pending', category: 'Health & Pharma' },
  { id: 'p3', name: 'Eco Kraft Boxes', seller: 'PackAge Labs', status: 'Pending', category: 'Packaging' },
]

const rfqs = [
  {
    id: 'rfq-2109',
    product: 'Eco Kraft Boxes',
    buyer: 'PackMart Solutions',
    seller: 'PackAge Labs',
    status: 'Awaiting response',
    created: '24 Nov 2025',
  },
  {
    id: 'rfq-2110',
    product: 'N95 Medical Respirators',
    buyer: 'Pulse Hospitals',
    seller: 'Guardian Health',
    status: 'Responded',
    created: '23 Nov 2025',
  },
  {
    id: 'rfq-2111',
    product: 'Cold-Pressed Cooking Oil',
    buyer: 'Fresh Basket Retail',
    seller: 'Saffron Harvest Co.',
    status: 'Awaiting response',
    created: '22 Nov 2025',
  },
]

// Mock KYC queues – in real app this would come from the admin KYC APIs
const sellerKYCQueue = [
  {
    id: 'skyc-101',
    name: 'Nova Foods',
    contact: 'kyc@novafoods.com',
    business: 'Food & FMCG',
    city: 'Pune',
    state: 'Maharashtra',
    submitted: '2 days ago',
  },
  {
    id: 'skyc-102',
    name: 'PackAge Labs',
    contact: 'compliance@packagelabs.in',
    business: 'Packaging',
    city: 'Ahmedabad',
    state: 'Gujarat',
    submitted: '3 days ago',
  },
]

const buyerKYCQueue = [
  {
    id: 'bkyc-201',
    name: 'Fresh Basket Retail',
    contact: 'kyc@freshbasket.com',
    business: 'Modern trade retail',
    city: 'Mumbai',
    state: 'Maharashtra',
    submitted: '1 day ago',
  },
  {
    id: 'bkyc-202',
    name: 'Pulse Hospitals',
    contact: 'kyc@pulsehospitals.in',
    business: 'Healthcare',
    city: 'Hyderabad',
    state: 'Telangana',
    submitted: '4 days ago',
  },
]
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
        helper: `${sellers.filter((s) => s.status === 'Pending').length} pending approvals`,
        gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
        borderColor: 'border-teal-500',
        iconBg: 'bg-teal-500/20',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700',
      },
      {
        icon: Package,
        label: 'Total Products',
        value: products.length.toLocaleString(),
        helper: 'Live inventory',
        gradient: 'from-yellow-500/20 via-yellow-400/15 to-yellow-500/20',
        borderColor: 'border-yellow-500',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-700',
      },
      {
        icon: AlertCircle,
        label: 'Pending Approvals',
        value: products.filter((p) => p.status === 'Pending').length.toString(),
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
        helper: `${rfqs.filter((r) => r.status === 'Awaiting response').length} awaiting reply`,
        gradient: 'from-teal-500/20 via-teal-400/15 to-teal-500/20',
        borderColor: 'border-teal-500',
        iconBg: 'bg-teal-500/20',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700',
      },
    ],
    []
  )

  const kpisSecondary = useMemo(() => {
    const pendingSellers = sellers.filter((s) => s.status === 'Pending').length
    const awaitingRFQs = rfqs.filter((r) => r.status === 'Awaiting response').length
    const respondedRFQs = rfqs.filter((r) => r.status === 'Responded').length
    const liveProducts = products.filter((p) => p.status === 'Live').length

    return [
      {
        icon: Store,
        label: 'Seller approvals pending',
        value: pendingSellers.toString(),
        helper: 'Sellers awaiting review',
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
        label: 'Blocked accounts',
        value: '0',
        helper: 'Monitoring risk & abuse',
        gradient: 'from-rose-500/20 via-rose-400/15 to-rose-500/20',
        borderColor: 'border-red-700',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-700',
      },
    ]
  }, [])

  const pendingProducts = useMemo(() => products.filter((p) => p.status === 'Pending'), [])

  return (
    <div className="space-y-8">
      {/* KPI Overview Cards */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">Overview Metrics</h2>
        <div className="rounded-3xl border border-neutral-300/80 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* Secondary KPI row */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {kpisSecondary.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </div>
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
            subtitle={`Showing latest ${Math.min(5, sellerKYCQueue.length)} of ${sellerKYCQueue.length} sellers pending verification`}
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
            subtitle={`Showing latest ${Math.min(5, buyerKYCQueue.length)} of ${buyerKYCQueue.length} buyers pending verification`}
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

