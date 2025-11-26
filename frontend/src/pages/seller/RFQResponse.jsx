import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQResponseForm from '../../components/seller/RFQResponseForm.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import { rfqs } from '../../mocks/rfqs.js'

const RFQResponse = () => {
  const { rfqId } = useParams()
  const rfq = rfqs.find((item) => item.id === rfqId) ?? rfqs[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card
        title={rfq.productName}
        subtitle={`Buyer · ${rfq.buyer}`}
        className="border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-blue-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.16)]"
      >
        <div className="grid gap-6 text-sm sm:grid-cols-2">
          <div className="space-y-4">
            <dl className="space-y-1">
              <dt className="text-neutral-500">RFQ ID</dt>
              <dd className="font-mono text-sm font-semibold text-neutral-900">{rfq.id}</dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500">Quantity</dt>
              <dd className="text-lg font-semibold text-neutral-900">
                {rfq.quantity.toLocaleString()} units
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500">Requested on</dt>
              <dd className="text-sm font-medium text-neutral-800">{rfq.createdOn}</dd>
            </dl>
          </div>

          <div className="space-y-4 border-t border-emerald-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6">
            <dl className="space-y-1">
              <dt className="text-neutral-500">Status</dt>
              <dd>
                <StatusTag tone={rfq.status === 'Responded' ? 'success' : 'warning'}>{rfq.status}</StatusTag>
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500">Delivery location</dt>
              <dd className="text-lg font-semibold text-neutral-900">{rfq.location}</dd>
            </dl>
          </div>
        </div>
      </Card>

      <Card
        title="Respond to RFQ"
        subtitle="Share final price and commercial terms in one compact view."
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_18px_50px_rgba(37,99,235,0.16)]"
      >
        <RFQResponseForm rfqId={rfq.id} />
      </Card>
    </div>
  )
}

export default RFQResponse
