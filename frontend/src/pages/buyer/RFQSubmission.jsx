import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQForm from '../../components/buyer/RFQForm.jsx'
import { products } from '../../mocks/products.js'

const RFQSubmission = () => {
  const { productId } = useParams()
  const product = useMemo(() => products.find((item) => item.id === productId) ?? products[0], [productId])

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <Card
        title={`RFQ for ${product.name}`}
        subtitle="All fields are mandatory unless marked optional."
      >
        <RFQForm productName={product.name} />
      </Card>
      <Card title="Product summary">
        <ul className="space-y-3 text-sm text-neutral-600">
          <li>
            <strong className="text-neutral-900">Price:</strong> ₹{product.priceMin} – ₹{product.priceMax}
          </li>
          <li>
            <strong className="text-neutral-900">MOQ:</strong> {product.moq} units
          </li>
          <li>
            <strong className="text-neutral-900">Seller:</strong> {product.seller}
          </li>
          <li>
            <strong className="text-neutral-900">Location:</strong> {product.city}, {product.state}
          </li>
        </ul>
      </Card>
    </div>
  )
}

export default RFQSubmission
