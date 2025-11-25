import PropTypes from 'prop-types'

const palette = {
  Active: 'bg-status-success/10 text-status-success',
  Pending: 'bg-brand-accent/10 text-brand-accent',
  Blocked: 'bg-status-danger/10 text-status-danger',
}

const UserStatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${palette[status] || ''}`}>{status}</span>
)

UserStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default UserStatusBadge
