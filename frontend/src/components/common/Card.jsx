import PropTypes from 'prop-types'

const Card = ({ as: Component = 'section', title, subtitle, actions, children, className = '' }) => (
  <Component
    className={`rounded-3xl border border-surface-border bg-white/90 p-6 shadow-card ${className}`.trim()}
  >
    {(title || subtitle || actions) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </Component>
)

Card.propTypes = {
  as: PropTypes.elementType,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Card

