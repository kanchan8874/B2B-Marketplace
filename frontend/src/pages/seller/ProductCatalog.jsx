import { useState } from 'react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductListTable from '../../components/seller/ProductListTable.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { products } from '../../mocks/products.js'

const ProductCatalog = () => {
  const [items] = useState(
    products.map((product) => ({
      ...product,
      status: Math.random() > 0.5 ? 'Live' : 'Pending',
    }))
  )

  return (
    <div className="space-y-8">
      <Card
        title="Product catalogue"
        subtitle="Keep pricing transparent and MOQ updated."
        actions={
          <Button as="a" href="/seller/products/new">
            Add product
          </Button>
        }
      >
        {items.length ? (
          <ProductListTable items={items} />
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
