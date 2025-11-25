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

const KPICard = ({ icon: Icon, label, value, delta, trend, className = '' }) => (
  <Card className={`bg-gradient-to-br from-white to-brand-primary/5 ${className}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-lg bg-brand-primary/10 p-2">
            <Icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">{label}</p>
        </div>
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
        <div className="mt-2 flex items-center gap-2">
          {trend && <TrendingUp className="h-4 w-4 text-status-success" aria-hidden="true" />}
          <p className="text-sm text-neutral-600">{delta}</p>
        </div>
      </div>
    </div>
  </Card>
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

const AdminDashboard = () => {
  const kpis = useMemo(
    () => [
      {
        icon: Users,
        label: 'Total Buyers',
        value: buyers.length.toLocaleString(),
        delta: 'All active accounts',
        trend: true,
      },
      {
        icon: Store,
        label: 'Total Sellers',
        value: sellers.length.toLocaleString(),
        delta: `${sellers.filter((s) => s.status === 'Pending').length} pending approvals`,
        trend: false,
      },
      {
        icon: Package,
        label: 'Total Products',
        value: products.length.toLocaleString(),
        delta: 'Live inventory',
        trend: true,
      },
      {
        icon: AlertCircle,
        label: 'Pending Approvals',
        value: products.filter((p) => p.status === 'Pending').length.toString(),
        delta: 'Products awaiting review',
        trend: false,
      },
      {
        icon: FileText,
        label: 'Total RFQs',
        value: rfqs.length.toLocaleString(),
        delta: `${rfqs.filter((r) => r.status === 'Awaiting response').length} awaiting reply`,
        trend: true,
      },
    ],
    []
  )

  const pendingProducts = useMemo(() => products.filter((p) => p.status === 'Pending'), [])

  return (
    <div className="space-y-8">
      {/* KPI Overview Cards */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-neutral-900">Overview Metrics</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      {/* User Management Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">User Management</h2>
          <div className="flex gap-3">
            <Button as={Link} to="/admin/users" variant="ghost" size="sm">
              View All Buyers
            </Button>
            <Button as={Link} to="/admin/sellers" variant="ghost" size="sm">
              View All Sellers
            </Button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Buyers List" subtitle={`${buyers.length} active buyers`}>
            <DataTable columns={columnsBuyers} data={buyers.slice(0, 3)} />
            {buyers.length > 3 && (
              <div className="mt-4 text-center">
                <Button as={Link} to="/admin/users" variant="ghost" size="sm">
                  View all {buyers.length} buyers →
                </Button>
              </div>
            )}
          </Card>
          <Card title="Sellers List" subtitle={`${sellers.length} sellers • ${sellers.filter((s) => s.status === 'Pending').length} pending`}>
            <DataTable columns={columnsSellers} data={sellers.slice(0, 3)} />
            {sellers.length > 3 && (
              <div className="mt-4 text-center">
                <Button as={Link} to="/admin/sellers" variant="ghost" size="sm">
                  View all {sellers.length} sellers →
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Product Management Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Product Management</h2>
          <Button as={Link} to="/admin/products" variant="ghost" size="sm">
            View All Products
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="All Products" subtitle={`${products.length} total products`}>
            <DataTable columns={columnsProducts} data={products} />
          </Card>
          <Card
            title="Pending Approval Products"
            subtitle={`${pendingProducts.length} products awaiting review`}
            className="border-2 border-status-warning/20"
          >
            <DataTable columns={columnsProducts} data={pendingProducts} />
            {pendingProducts.length === 0 && (
              <div className="py-8 text-center text-sm text-neutral-500">No pending approvals</div>
            )}
          </Card>
        </div>
      </section>

      {/* RFQ Monitoring Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">RFQ Monitoring</h2>
          <Button as={Link} to="/admin/rfqs" variant="ghost" size="sm">
            View All RFQs
          </Button>
        </div>
        <Card title="RFQ Activity" subtitle="Read-only log of buyer ↔ seller exchanges">
          <DataTable columns={columnsRFQ} data={rfqs} />
        </Card>
      </section>
    </div>
  )
}

export default AdminDashboard

