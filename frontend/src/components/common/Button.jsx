import PropTypes from 'prop-types'

// Enterprise-grade, accessible base styles
const baseClasses =
  'inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variants = {
  // Primary: solid brand CTA
  primary:
    'bg-brand-primary text-white shadow-[0_2px_8px_rgba(15,98,254,0.25)] hover:bg-brand-primary/95 hover:shadow-[0_4px_14px_rgba(15,98,254,0.35)] active:bg-brand-primary active:scale-[0.98] focus-visible:ring-brand-primary',

  // Secondary: soft filled button with subtle border (neutral/secondary actions)
  secondary:
    'bg-white text-neutral-900 border border-neutral-300 shadow-sm hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 active:scale-[0.98] focus-visible:ring-neutral-400',

  // Outline: minimal button for tertiary / ghost-style actions
  outline:
    'bg-transparent text-neutral-800 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-neutral-400',
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

