import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, AlertCircle } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductListTable from '../../components/seller/ProductListTable.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { getSellerSubscription } from '../../services/subscriptionService.js'
import { listProducts, deleteProduct } from '../../services/productService.js'
import { useAuth } from '../../hooks/useAuth.js'

const ITEMS_PER_PAGE = 7

const ProductCatalog = () => {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('All')
  const [subscription, setSubscription] = useState(null)
  const [items, setItems] = useState([])
  const [productToDelete, setProductToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSubscription()
  }, [])

  useEffect(() => {
    const sellerId = user?.id || user?._id
    if (sellerId) {
      loadProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, user?.id, user?._id])

  const loadSubscription = async () => {
    try {
      const response = await getSellerSubscription()
      if (response.data) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const sellerId = user?.id || user?._id
      const data = await listProducts({
        includeAuth: true,
        seller: sellerId,
        status: statusFilter === 'All' ? undefined : statusFilter,
      })
      setItems(data || [])
    } catch (error) {
      console.error('Failed to load products:', error)
      setError(error.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems =
    statusFilter === 'All' ? items : items.filter((product) => product.status === statusFilter)

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handleEdit = (row) => {
    navigate(`/seller/products/${row._id}/edit`)
  }

  const handleView = (row) => {
    navigate(`/seller/products/${row._id}/view`)
  }

  const handleDelete = (row) => {
    setProductToDelete(row)
  }

  const handleAddProduct = () => {
    navigate('/seller/products/new')
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return
    // Remove locally, then call API
    setItems((prev) => {
      const deleted = prev.find((product) => product._id === productToDelete._id)
      const next = prev.filter((product) => product._id !== productToDelete._id)
      const maxPage = Math.max(1, Math.ceil(next.length / ITEMS_PER_PAGE))
      if (page > maxPage) {
        setPage(maxPage)
      }
      return next
    })
    const toDelete = productToDelete
    setProductToDelete(null)
    deleteProduct(toDelete._id).catch((error) => {
      console.error('Failed to delete product:', error)
      // On error, refresh list to stay consistent
      loadProducts()
    })
  }

  const handleCancelDelete = () => {
    setProductToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Subscription Info Banner */}
      {subscription && (
        <div
          className={`rounded-2xl border-2 p-4 ${
            subscription.tier === 'Silver'
              ? 'border-neutral-300 bg-neutral-50'
              : subscription.tier === 'Gold'
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-purple-300 bg-purple-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown
                className={`h-5 w-5 ${
                  subscription.tier === 'Silver'
                    ? 'text-neutral-600'
                    : subscription.tier === 'Gold'
                      ? 'text-yellow-700'
                      : 'text-purple-700'
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {subscription.tier} Tier · {subscription.currentProductCount} / {subscription.productLimit} products
                </p>
                <p className="text-xs text-neutral-600">
                  {subscription.remainingSlots > 0
                    ? `${subscription.remainingSlots} slot${subscription.remainingSlots > 1 ? 's' : ''} remaining`
                    : 'Limit reached'}
                </p>
              </div>
            </div>
            {!subscription.canAddMore && (
              <div className="flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold">Upgrade to add more</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Card
        title="Product catalogue"
        subtitle="Keep pricing transparent and MOQ updated."
        actions={
          <div className="flex items-center gap-3">
            <div
              className="hidden rounded-full bg-white/80 p-1 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200/70 sm:flex"
              role="tablist"
              aria-label="Filter products by status"
            >
              {['All', 'Live', 'Pending', 'Draft'].map((status) => {
                const isActive = statusFilter === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status)
                      setPage(1)
                    }}
                    role="tab"
                    aria-selected={isActive}
                    className={`rounded-full px-3 py-1.5 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
            <Button onClick={handleAddProduct} disabled={subscription && !subscription.canAddMore}>
              Add product
            </Button>
          </div>
        }
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-10 text-center text-sm text-neutral-600">Loading products...</div>
        ) : items.length ? (
          <div className="space-y-5">
            <ProductListTable
              items={paginatedItems}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        ) : (
          <EmptyState
            title="No products yet"
            description="Add your first SKU to start receiving RFQs."
            actionLabel="Add product"
            onAction={handleAddProduct}
          />
        )}
      </Card>

      {/* Accessible confirmation dialog for delete */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
          >
            <h2 id="delete-product-title" className="text-lg font-semibold text-neutral-900">
              Delete product?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              You&apos;re about to permanently remove{' '}
              <span className="font-semibold text-neutral-900">{productToDelete.name}</span> from your catalogue.
              Buyers will no longer see this SKU or be able to send new RFQs for it.
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs text-neutral-700">
              <p>
                <span className="font-semibold">Price band:</span> ₹{productToDelete.priceMin} – ₹
                {productToDelete.priceMax}
              </p>
              <p className="mt-1">
                <span className="font-semibold">MOQ:</span> {productToDelete.moq} units
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm bg-status-danger hover:bg-status-danger/90 shadow-[0_8px_24px_rgba(192,28,40,0.35)]"
                onClick={handleConfirmDelete}
              >
                Delete product
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductCatalog
