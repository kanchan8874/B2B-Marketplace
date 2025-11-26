import { useMemo, useState } from 'react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductListTable from '../../components/seller/ProductListTable.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { products } from '../../mocks/products.js'

const ITEMS_PER_PAGE = 7

const ProductCatalog = () => {
  const [page, setPage] = useState(1)

  const items = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        status: Math.random() > 0.5 ? 'Live' : 'Pending',
      })),
    []
  )

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, endIndex)

  const handleEdit = (row) => {
    console.info('Edit product', row.id)
  }

  const handleDelete = (row) => {
    console.info('Delete product', row.id)
  }

  return (
    <div className="space-y-6">
      <Card
        title="Product catalogue"
        subtitle="Keep pricing transparent and MOQ updated."
        actions={
          <Button as="a" href="/seller/products/new">
            Add product
          </Button>
        }
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        {items.length ? (
          <div className="space-y-5">
            <ProductListTable items={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        ) : (
          <EmptyState
            title="No products yet"
            description="Add your first SKU to start receiving RFQs."
            actionLabel="Add product"
          />
        )}
      </Card>
    </div>
  )
}

export default ProductCatalog
