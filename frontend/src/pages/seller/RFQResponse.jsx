import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQResponseForm from '../../components/seller/RFQResponseForm.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import { rfqs } from '../../mocks/rfqs.js'
import { products } from '../../mocks/products.js'

const RFQResponse = () => {
  const { rfqId } = useParams()
  const rfq = rfqs.find((item) => item.id === rfqId) ?? rfqs[0]

  const product = useMemo(
    () => products.find((item) => item.name === rfq.productName) ?? products[0],
    [rfq.productName],
  )

  const mainImage =
    product?.gallery?.[0] ||
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card
        title={rfq.productName}
        subtitle={`Buyer · ${rfq.buyer}`}
        className="border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-blue-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.16)]"
      >
        <div className="grid gap-6 text-sm md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] items-stretch">
          {/* RFQ details on the left */}
          <div className="space-y-4">
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">RFQ ID</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold text-neutral-900">{rfq.id}</dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Quantity</dt>
              <dd className="mt-0.5 text-lg font-semibold text-neutral-900">
                {rfq.quantity.toLocaleString()} units
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Requested on</dt>
              <dd className="mt-0.5 text-sm font-medium text-neutral-800">{rfq.createdOn}</dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Status</dt>
              <dd className="mt-0.5">
                <StatusTag tone={rfq.status === 'Responded' ? 'success' : 'warning'}>{rfq.status}</StatusTag>
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Delivery location</dt>
              <dd className="mt-0.5 text-lg font-semibold text-neutral-900">{rfq.location}</dd>
            </dl>
          </div>

          {/* Large product image on the right */}
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-neutral-100">
            <img src={mainImage} alt={rfq.productName} className="h-full w-full object-cover" />
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
