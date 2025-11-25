import PropTypes from 'prop-types'
import ProductCard from './ProductCard.jsx'

const ProductGrid = ({ products }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ProductGrid
