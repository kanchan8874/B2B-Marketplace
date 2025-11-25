import PropTypes from 'prop-types'

const baseClasses =
  'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:opacity-60'

const variants = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary/95 active:bg-brand-primary active:scale-[0.98] focus-visible:outline-brand-primary shadow-[0_2px_8px_rgba(15,98,254,0.2)] hover:shadow-[0_4px_16px_rgba(15,98,254,0.3)] transition-all duration-200',
  secondary:
    'bg-teal-50/80 text-teal-700 border border-teal-200/60 hover:bg-teal-100/90 hover:border-teal-300 active:bg-teal-200 active:scale-[0.98] focus-visible:outline-teal-500 shadow-sm hover:shadow-md transition-all duration-200',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-neutral-500 transition-all duration-200',
  danger: 'bg-status-danger text-white hover:bg-status-danger/90 active:bg-status-danger/95 active:scale-[0.98] focus-visible:outline-status-danger shadow-sm hover:shadow-md transition-all duration-200',
}

const sizes = {
  sm: 'text-sm px-4 py-2.5 rounded-xl font-semibold',
  md: 'text-sm px-6 py-3 rounded-2xl font-semibold',
  lg: 'text-base px-8 py-4 rounded-2xl font-semibold',
}

const Button = ({ as: Component = 'button', children, variant = 'primary', size = 'md', className = '', ...props }) => (
  <Component className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim()} {...props}>
    {children}
  </Component>
)

Button.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  className: PropTypes.string,
}

export default Button

