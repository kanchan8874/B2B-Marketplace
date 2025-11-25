import { useState, useMemo } from 'react'
import { Package, Search, AlertCircle } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { products } from '../../mocks/products.js'

// Enrich products with status (in real app, this comes from API)
const enrichedProducts = products.map((product, index) => ({
  ...product,
  status: index === 1 || index === 2 ? 'Pending' : 'Live',
  submittedOn: '24 Nov 2025',
  category: 'Food & Agriculture',
}))

const allProductsColumns = [
  { header: 'Product Name', accessor: 'name' },
  { header: 'Seller', accessor: 'seller' },
  { header: 'Category', accessor: 'category' },
  { header: 'Price Range', accessor: (row) => `₹${row.priceMin} - ₹${row.priceMax}` },
  { header: 'MOQ', accessor: (row) => row.moq.toLocaleString() },
  { header: 'Submitted', accessor: 'submittedOn' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone={row.status === 'Live' ? 'success' : 'warning'}>{row.status}</StatusTag>,
  },
]

const pendingProductsColumns = [
  { header: 'Product Name', accessor: 'name' },
  { header: 'Seller', accessor: 'seller' },
  { header: 'Category', accessor: 'category' },
  { header: 'Price Range', accessor: (row) => `₹${row.priceMin} - ₹${row.priceMax}` },
  { header: 'MOQ', accessor: (row) => row.moq.toLocaleString() },
  { header: 'Submitted', accessor: 'submittedOn' },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary" className="h-7 px-3 text-xs">
          Approve
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
          Reject
        </Button>
      </div>
    ),
  },
]

const ProductModeration = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'pending'

  const allProducts = enrichedProducts
  const pendingProducts = useMemo(() => enrichedProducts.filter((p) => p.status === 'Pending'), [])

  const filteredAllProducts = allProducts.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.seller.toLowerCase().includes(query)
  })

  const filteredPendingProducts = pendingProducts.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.seller.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'all'
              ? 'border-b-2 border-brand-primary text-brand-primary'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
          aria-selected={activeTab === 'all'}
          role="tab"
        >
          All Products ({allProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'pending'
              ? 'border-b-2 border-brand-primary text-brand-primary'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
          aria-selected={activeTab === 'pending'}
          role="tab"
        >
          Pending Approvals ({pendingProducts.length})
        </button>
      </div>

      {/* All Products Tab */}
      {activeTab === 'all' && (
        <Card
          title="All Products"
          subtitle={`${allProducts.length} total products • ${pendingProducts.length} pending approval`}
        >
          <div className="mb-6">
            <FormField
              id="productSearch"
              name="productSearch"
              label="Search products"
              type="text"
              placeholder="Search by product name or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <DataTable columns={allProductsColumns} data={filteredAllProducts} />
          {filteredAllProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
              <p className="text-sm text-neutral-500">No products found matching your search.</p>
            </div>
          )}
        </Card>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === 'pending' && (
        <Card
          title="Pending Approval Products"
          subtitle={`${pendingProducts.length} products awaiting review`}
          className="border-2 border-status-warning/20"
        >
          <div className="mb-6">
            <FormField
              id="pendingSearch"
              name="pendingSearch"
              label="Search pending products"
              type="text"
              placeholder="Search by product name or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          {filteredPendingProducts.length > 0 ? (
            <DataTable columns={pendingProductsColumns} data={filteredPendingProducts} />
          ) : (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
              <p className="text-sm text-neutral-500">No pending approvals at this time.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default ProductModeration
