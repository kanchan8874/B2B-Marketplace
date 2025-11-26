import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import ProductGrid from '../../components/buyer/ProductGrid.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import FormField from '../../components/common/FormField.jsx'
import { products } from '../../mocks/products.js'
import { categories } from '../../mocks/categories.js'

const ITEMS_PER_PAGE = 6

const ProductListing = () => {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const categoryId = searchParams.get('category')

  const enrichedProducts = useMemo(() => {
    const subset = products.filter((product) => (categoryId ? product.categoryId === categoryId : true))
    const searched = subset.filter((product) =>
      searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    return searched.map((product) => ({
      ...product,
      categoryLabel: categories.find((cat) => cat.id === product.categoryId)?.name,
    }))
  }, [categoryId, searchQuery])

  const totalPages = Math.ceil(enrichedProducts.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = enrichedProducts.slice(startIndex, endIndex)

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, categoryId])

  return (
    <div className="space-y-6">
      <Card
        title="Product listing"
        subtitle={
          categoryId
            ? `Showing products in ${categories.find((cat) => cat.id === categoryId)?.name}`
            : 'Browse verified suppliers with MOQ, price band, and seller context.'
        }
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <FormField
            id="productSearch"
            label="Keyword search"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            icon={Search}
          />
        </div>
        <ProductGrid products={paginatedProducts} />
      </Card>
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}

export default ProductListing
