import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Search, AlertCircle } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { listProducts, updateProductStatusAdmin } from '../../services/productService.js'

const renderProductCell = (row) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
      {row.images && row.images[0] ? (
        <img src={row.images[0]} alt={row.name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-neutral-500">{row.name?.charAt(0)}</span>
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-neutral-900">{row.name}</p>
      {row.shortDescription && (
        <p className="mt-0.5 truncate text-xs text-neutral-500 max-w-[220px]">
          {row.shortDescription}
        </p>
      )}
    </div>
  </div>
)

const allProductsColumns = (onView) => [
  { header: 'Product', accessor: 'name', cell: renderProductCell },
  { header: 'Seller', accessor: 'sellerName' },
  { header: 'Category', accessor: 'categoryName' },
  { header: 'Price Range', accessor: 'priceRange' },
  { header: 'MOQ', accessor: 'moqText' },
  { header: 'Submitted', accessor: 'submittedOn' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <StatusTag
        tone={
          row.status === 'Live'
            ? 'success'
            : row.status === 'Pending'
            ? 'warning'
            : row.status === 'Rejected'
            ? 'danger'
            : 'neutral'
        }
      >
        {row.status}
      </StatusTag>
    ),
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-3 text-xs rounded-full"
        onClick={() => onView(row)}
      >
        View
      </Button>
    ),
  },
]

const createPendingProductsColumns = (onActionClick, onView) => [
  { header: 'Product', accessor: 'name', cell: renderProductCell },
  { header: 'Seller', accessor: 'sellerName' },
  { header: 'Category', accessor: 'categoryName' },
  { header: 'Price Range', accessor: 'priceRange' },
  { header: 'MOQ', accessor: 'moqText' },
  { header: 'Submitted', accessor: 'submittedOn' },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-3 text-xs rounded-full"
          onClick={() => onView(row)}
        >
          View
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="h-7 px-3 text-xs"
          onClick={() => onActionClick({ action: 'approve', record: row })}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10"
          onClick={() => onActionClick({ action: 'reject', record: row })}
        >
          Reject
        </Button>
      </div>
    ),
  },
]

const ProductModeration = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'pending'
  const [pageAll, setPageAll] = useState(1)
  const [pagePending, setPagePending] = useState(1)
  const [allProductsState, setAllProductsState] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const navigate = useNavigate()

  const PAGE_SIZE = 10

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await listProducts({ includeAuth: true })
        setAllProductsState(
          (data || []).map((p) => ({
            ...p,
            submittedOn: new Date(p.createdAt).toLocaleDateString(),
            sellerName: p.seller?.name || p.seller?.companyName || '—',
            categoryName: p.category?.name || '—',
            priceRange: `₹${p.priceMin} - ₹${p.priceMax}` ,
            moqText: p.moq?.toLocaleString?.() ?? '—',
          })),
        )
      } catch (err) {
        console.error('Failed to load products for moderation:', err)
        setError(err.message || 'Failed to load products.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const allProducts = allProductsState
  const pendingProducts = useMemo(
    () => allProductsState.filter((p) => p.status === 'Pending'),
    [allProductsState],
  )

  const filteredAllProducts = allProducts.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const sellerName = (item.seller?.name || '').toLowerCase()
    return item.name.toLowerCase().includes(query) || sellerName.includes(query)
  })

  const filteredPendingProducts = pendingProducts.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const sellerName = (item.seller?.name || '').toLowerCase()
    return item.name.toLowerCase().includes(query) || sellerName.includes(query)
  })

  const totalPagesAll = Math.max(1, Math.ceil(filteredAllProducts.length / PAGE_SIZE))
  const totalPagesPending = Math.max(1, Math.ceil(filteredPendingProducts.length / PAGE_SIZE))

  const paginatedAllProducts = filteredAllProducts.slice(
    (pageAll - 1) * PAGE_SIZE,
    (pageAll - 1) * PAGE_SIZE + PAGE_SIZE,
  )
  const paginatedPendingProducts = filteredPendingProducts.slice(
    (pagePending - 1) * PAGE_SIZE,
    (pagePending - 1) * PAGE_SIZE + PAGE_SIZE,
  )

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // reset page when switching views
    if (tab === 'all') {
      setPageAll(1)
    } else {
      setPagePending(1)
    }
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) return

    const { action, record } = pendingAction

    try {
      const nextStatus = action === 'approve' ? 'Live' : 'Rejected'
      await updateProductStatusAdmin(record._id, nextStatus)
      setAllProductsState((prev) =>
        prev.map((product) => {
          if (product._id !== record._id) return product
          return { ...product, status: nextStatus }
        }),
      )
    } catch (err) {
      console.error('Failed to update product status:', err)
      setError(err.message || 'Failed to update product status.')
    } finally {
      setPendingAction(null)
    }
  }

  const handleCancelAction = () => {
    setPendingAction(null)
  }

  const actionLabelMap = {
    approve: 'Approve',
    reject: 'Reject',
  }

  const actionDescriptionMap = {
    approve: 'This product will be marked Live and visible to buyers for RFQs.',
    reject: 'This product will be marked Rejected and will not appear to buyers.',
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-border">
        <button
          onClick={() => handleTabChange('all')}
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
          onClick={() => handleTabChange('pending')}
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
          className="bg-gradient-to-br from-blue-50/70 via-white to-teal-50/70"
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
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="rounded-full bg-slate-50/80 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {loading ? (
            <div className="py-10 text-center text-sm text-neutral-600">Loading products...</div>
          ) : (
            <>
              <DataTable
                columns={allProductsColumns((row) => navigate(`/admin/products/${row._id}/view`))}
                data={paginatedAllProducts}
              />
              {filteredAllProducts.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
                  <p className="text-sm text-neutral-500">No products found matching your search.</p>
                </div>
              )}
              {filteredAllProducts.length > 0 && totalPagesAll > 1 && (
                <div className="mt-6">
                  <Pagination page={pageAll} totalPages={totalPagesAll} onPageChange={setPageAll} />
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === 'pending' && (
        <Card
          title="Pending Approval Products"
          subtitle={`${pendingProducts.length} products awaiting review`}
          className="border-2 border-status-warning/20 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/60"
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
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="rounded-full bg-slate-50/80 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm"
            />
          </div>
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {loading ? (
            <div className="py-10 text-center text-sm text-neutral-600">Loading pending products...</div>
          ) : filteredPendingProducts.length > 0 ? (
            <>
              <DataTable
                columns={createPendingProductsColumns(
                  setPendingAction,
                  (row) => navigate(`/admin/products/${row._id}/view`),
                )}
                data={paginatedPendingProducts}
              />
              {totalPagesPending > 1 && (
                <div className="mt-6">
                  <Pagination
                    page={pagePending}
                    totalPages={totalPagesPending}
                    onPageChange={setPagePending}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
              <p className="text-sm text-neutral-500">No pending approvals at this time.</p>
            </div>
          )}
        </Card>
      )}

      {/* Confirmation dialog for product approvals */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-action-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)]"
          >
            <h2
              id="admin-product-action-title"
              className="text-lg font-semibold text-neutral-900"
            >
              {actionLabelMap[pendingAction.action]} product?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              You&apos;re about{' '}
              <span className="font-semibold text-neutral-900">
                {actionLabelMap[pendingAction.action]?.toLowerCase()}
              </span>{' '}
              the product{' '}
              <span className="font-semibold text-neutral-900">
                {pendingAction.record.name}
              </span>
              . {actionDescriptionMap[pendingAction.action]}
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs text-neutral-700">
              <p className="flex justify-between gap-4">
                <span className="text-neutral-500">Seller</span>
                <span className="font-semibold text-neutral-900">
                  {pendingAction.record.seller?.name || '—'}
                </span>
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="text-neutral-500">Category</span>
                <span className="font-semibold text-neutral-900">
                  {pendingAction.record.category?.name || '—'}
                </span>
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="text-neutral-500">Price band</span>
                <span className="font-semibold text-neutral-900">
                  ₹{pendingAction.record.priceMin} – ₹{pendingAction.record.priceMax}
                </span>
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm"
                onClick={handleCancelAction}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm bg-status-danger hover:bg-status-danger/90 shadow-[0_8px_24px_rgba(192,28,40,0.35)]"
                onClick={handleConfirmAction}
              >
                {actionLabelMap[pendingAction.action]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductModeration
