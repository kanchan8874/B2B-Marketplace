import PropTypes from 'prop-types'
import Card from '../../components/common/Card.jsx'
import ProductForm from '../../components/seller/ProductForm.jsx'

const ProductEditor = ({ mode = 'create' }) => (
  <Card
    title={mode === 'create' ? 'Add a new product' : 'Update product'}
    subtitle="Fill in structured catalogue fields to keep approvals fast."
  >
    <ProductForm submitLabel={mode === 'create' ? 'Publish product' : 'Save changes'} />
  </Card>
)

ProductEditor.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
}

export default ProductEditor
