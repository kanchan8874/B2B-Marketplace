import PropTypes from 'prop-types'
import { useCallback } from 'react'

const baseInput =
  'w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-300 ease-out focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.1)] focus-visible:outline-none disabled:bg-neutral-50 disabled:cursor-not-allowed hover:border-neutral-300'

// Fields that should auto-capitalize first letter
const AUTO_CAPITALIZE_FIELDS = [
  'name', 'contactName', 'buyerName', 'sellerName', 'companyName',
  'city', 'state', 'address', 'location', 'deliveryLocation',
  'firstName', 'lastName', 'fullName', 'contactPerson'
]

const shouldAutoCapitalize = (name, type) => {
  if (type === 'email' || type === 'password' || type === 'tel' || type === 'url') return false
  return AUTO_CAPITALIZE_FIELDS.some(field => name?.toLowerCase().includes(field.toLowerCase()))
}

const FormField = ({
  label,
  id,
  helper,
  error,
  required,
  as = 'input',
  type = 'text',
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  maxLength,
  showCharCount = false,
  value = '',
  wrapperClassName = '',
  inputClassName = '',
  name,
  onChange,
  onBlur,
  autoCapitalize = true,
  ...props
}) => {
  const FieldTag = as
  const charCount = typeof value === 'string' ? value.length : 0
  const shouldCapitalize = autoCapitalize && shouldAutoCapitalize(name || id, type)

  // Auto-capitalize handler
  const handleChange = useCallback((e) => {
    if (shouldCapitalize && e.target.value.length > 0) {
      const firstChar = e.target.value[0]
      const rest = e.target.value.slice(1)
      // Only capitalize if first char is lowercase letter
      if (firstChar >= 'a' && firstChar <= 'z') {
        e.target.value = firstChar.toUpperCase() + rest
      }
    }
    if (onChange) onChange(e)
  }, [shouldCapitalize, onChange])

  // Build aria-describedby with all relevant IDs
  const ariaDescribedBy = [
    helper ? `${id}-helper` : null,
    error ? `${id}-error` : null,
    showCharCount && maxLength ? `${id}-char-count` : null
  ].filter(Boolean).join(' ') || undefined

  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 tracking-tight">
        {label}
        {required && (
          <span className="ml-1.5 text-status-danger" aria-label="required field">
            *
          </span>
        )}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-brand-primary"
            aria-hidden="true"
          />
        )}
        <FieldTag
          id={id}
          name={name || id}
          type={type}
          value={value}
          maxLength={maxLength}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          aria-errormessage={error ? `${id}-error` : undefined}
          className={`${baseInput} ${Icon ? 'pl-12' : ''} ${RightIcon ? 'pr-12' : ''} ${
            error ? 'border-status-danger ring-status-danger/20 focus:border-status-danger focus:ring-status-danger/20' : ''
          } ${inputClassName}`}
          onChange={handleChange}
          onBlur={onBlur}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-1 rounded-md p-1 transition-colors"
            aria-label={type === 'password' ? 'Toggle password visibility' : 'Action button'}
            aria-pressed={type === 'password' ? false : undefined}
            tabIndex={-1}
          >
            <RightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-1">
        {helper && (
          <p id={`${id}-helper`} className="text-xs text-neutral-500">
            {helper}
          </p>
        )}
        {error && (
          <p 
            id={`${id}-error`} 
            className="text-xs font-medium text-status-danger" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {showCharCount && maxLength && (
          <p 
            id={`${id}-char-count`} 
            className="text-xs text-neutral-400 ml-auto"
            aria-label={`Character count: ${charCount} of ${maxLength}`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  helper: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  as: PropTypes.oneOf(['input', 'textarea', 'select']),
  type: PropTypes.string,
  icon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  onRightIconClick: PropTypes.func,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  autoCapitalize: PropTypes.bool,
}

export default FormField
