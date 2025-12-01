import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductListTable from '../../components/seller/ProductListTable.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { products } from '../../mocks/products.js'

const ITEMS_PER_PAGE = 7

const ProductCatalog = () => {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All')
  const [items, setItems] = useState(() =>
    products.map((product) => {
      const statuses = ['Live', 'Pending', 'Draft']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      return {
        ...product,
        status: randomStatus,
      }
    }),
  )
  const [productToDelete, setProductToDelete] = useState(null)
  const [lastDeleted, setLastDeleted] = useState(null)

  const filteredItems =
    statusFilter === 'All' ? items : items.filter((product) => product.status === statusFilter)

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handleEdit = (row) => {
    navigate(`/seller/products/${row.id}/edit`)
  }

  const handleView = (row) => {
    navigate(`/seller/products/${row.id}/view`)
  }

  const handleDelete = (row) => {
    setProductToDelete(row)
  }

  const handleAddProduct = () => {
    navigate('/seller/products/new')
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return
    setItems((prev) => {
      const deleted = prev.find((product) => product.id === productToDelete.id)
      const next = prev.filter((product) => product.id !== productToDelete.id)
      const maxPage = Math.max(1, Math.ceil(next.length / ITEMS_PER_PAGE))
      if (page > maxPage) {
        setPage(maxPage)
      }
      if (deleted) {
        setLastDeleted(deleted)
      }
      return next
    })
    setProductToDelete(null)
  }

  const handleCancelDelete = () => {
    setProductToDelete(null)
  }

  const handleUndoDelete = () => {
    if (!lastDeleted) return
    setItems((prev) => [lastDeleted, ...prev])
    setLastDeleted(null)
    setPage(1)
  }

  return (
    <div className="space-y-6">
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
            <Button onClick={handleAddProduct}>Add product</Button>
          </div>
        }
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        {items.length ? (
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

      {/* Undo snackbar for accidental delete */}
      {lastDeleted && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-medium text-neutral-700">
            Product{' '}
            <span className="font-semibold text-neutral-900">{lastDeleted.name}</span> removed from
            your catalogue.
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUndoDelete}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full px-3 py-1"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => setLastDeleted(null)}
              className="text-[11px] text-neutral-500 hover:text-neutral-700 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog
