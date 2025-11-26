import PropTypes from 'prop-types'
import Card from '../../components/common/Card.jsx'
import ProductForm from '../../components/seller/ProductForm.jsx'

const ProductEditor = ({ mode = 'create' }) => (
  <section className="mx-auto max-w-4xl">
    <Card
      title={mode === 'create' ? 'Add a new product' : 'Update product'}
      subtitle="Minimal, structured fields to keep your catalogue clean and approvals fast."
      className="border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/60 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
    >
      <ProductForm submitLabel={mode === 'create' ? 'Publish product' : 'Save changes'} />
    </Card>
  </section>
)

ProductEditor.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
}

export default ProductEditor
