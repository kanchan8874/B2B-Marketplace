import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'
import StatusTag from '../common/StatusTag.jsx'

const getTone = (status) => {
  if (status === 'Declined') return 'danger'
  if (status === 'Accepted') return 'success'
  if (status === 'Quoted') return 'info'
  return 'warning'
}

const RFQList = ({ items }) => (
  <div className="space-y-4">
    {items.map((rfq) => (
      <article
        key={rfq.id}
        className="group rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-blue-50/60 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.14)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {rfq.buyer}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-neutral-900">{rfq.productName}</h3>
          </div>
          <StatusTag tone={getTone(rfq.status)}>{rfq.status}</StatusTag>
        </div>
        <dl className="mt-4 grid gap-4 text-xs text-neutral-600 sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">Quantity</dt>
            <dd className="mt-0.5 font-semibold text-neutral-900">{rfq.quantity.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Delivery</dt>
            <dd className="mt-0.5 font-semibold text-neutral-900">{rfq.location}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Received</dt>
            <dd className="mt-0.5 font-semibold text-neutral-900">{rfq.createdOn}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-500">
            RFQ ID: <span className="font-mono text-neutral-700">{rfq.id}</span>
          </p>
          <Button
            as={Link}
            to={`/seller/rfqs/${rfq.id}/respond`}
            size="sm"
            className="rounded-full px-4 text-xs font-semibold"
          >
            View & respond
          </Button>
        </div>
      </article>
    ))}
  </div>
)

RFQList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RFQList
