import PropTypes from 'prop-types'
import Button from './Button.jsx'

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="rounded-3xl border border-dashed border-surface-border bg-white/70 p-10 text-center shadow-subtle">
    <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
    <p className="mt-2 text-neutral-500">{description}</p>
    {actionLabel && (
      <Button onClick={onAction} className="mt-4">
        {actionLabel}
      </Button>
    )}
  </div>
)

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
}

export default EmptyState
