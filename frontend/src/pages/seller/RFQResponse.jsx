import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQResponseForm from '../../components/seller/RFQResponseForm.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import { rfqs } from '../../mocks/rfqs.js'

const RFQResponse = () => {
  const { rfqId } = useParams()
  const rfq = rfqs.find((item) => item.id === rfqId) ?? rfqs[0]

  return (
    <div className="space-y-8">
      <Card title={`RFQ detail: ${rfq.productName}`} subtitle={`Buyer · ${rfq.buyer}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <dl className="space-y-1 text-sm">
            <dt className="text-neutral-500">Quantity</dt>
            <dd className="text-lg font-semibold text-neutral-900">{rfq.quantity.toLocaleString()} units</dd>
          </dl>
          <dl className="space-y-1 text-sm">
            <dt className="text-neutral-500">Delivery location</dt>
            <dd className="text-lg font-semibold text-neutral-900">{rfq.location}</dd>
          </dl>
          <dl className="space-y-1 text-sm">
            <dt className="text-neutral-500">Status</dt>
            <dd>
              <StatusTag tone={rfq.status === 'Responded' ? 'success' : 'warning'}>{rfq.status}</StatusTag>
            </dd>
          </dl>
          <dl className="space-y-1 text-sm">
            <dt className="text-neutral-500">RFQ ID</dt>
            <dd className="text-lg font-semibold text-neutral-900">{rfq.id}</dd>
          </dl>
        </div>
      </Card>

      <Card title="Respond to RFQ" subtitle="Share final price and commercial terms.">
        <RFQResponseForm rfqId={rfq.id} />
      </Card>
    </div>
  )
}

export default RFQResponse
