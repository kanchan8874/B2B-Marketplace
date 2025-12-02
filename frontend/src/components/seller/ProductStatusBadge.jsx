import PropTypes from 'prop-types'

const statusMap = {
  Draft: 'bg-neutral-100 text-neutral-600',
  Live: 'bg-status-success/10 text-status-success',
  Pending: 'bg-brand-accent/10 text-brand-accent',
  'To Be Offered': 'bg-yellow-100 text-yellow-800',
}

const ProductStatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMap[status] || ''}`}>{status}</span>
)

ProductStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default ProductStatusBadge
