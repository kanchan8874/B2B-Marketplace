import PropTypes from 'prop-types'

const palette = {
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  danger: 'bg-status-danger/10 text-status-danger',
  info: 'bg-brand-primary/10 text-brand-primary',
  neutral: 'bg-neutral-100 text-neutral-600',
}

const StatusTag = ({ tone = 'neutral', children }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette[tone]}`}>
    {children}
  </span>
)

StatusTag.propTypes = {
  tone: PropTypes.oneOf(Object.keys(palette)),
  children: PropTypes.node.isRequired,
}

export default StatusTag

