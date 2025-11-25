import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'

const RFQList = ({ items }) => (
  <div className="space-y-4">
    {items.map((rfq) => (
      <article key={rfq.id} className="rounded-3xl border border-surface-border bg-white p-6 shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-neutral-500">{rfq.buyer}</p>
            <h3 className="text-lg font-semibold text-neutral-900">{rfq.productName}</h3>
          </div>
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            {rfq.status}
          </span>
        </div>
        <dl className="mt-4 grid gap-4 text-sm text-neutral-600 sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">Quantity</dt>
            <dd className="font-semibold text-neutral-900">{rfq.quantity}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Delivery</dt>
            <dd className="font-semibold text-neutral-900">{rfq.location}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Received</dt>
            <dd className="font-semibold text-neutral-900">{rfq.createdOn}</dd>
          </div>
        </dl>
        <Button as={Link} to={`/seller/rfqs/${rfq.id}/respond`} className="mt-4">
          Respond
        </Button>
      </article>
    ))}
  </div>
)

RFQList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RFQList
