import PropTypes from 'prop-types'

const baseInput =
  'w-full rounded-2xl border border-neutral-200/80 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-300 ease-out focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.1)] focus-visible:outline-none disabled:bg-neutral-50 disabled:cursor-not-allowed hover:border-neutral-300'

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
  ...props
}) => {
  const FieldTag = as
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 tracking-tight">
        {label}
        {required && <span className="ml-1.5 text-status-danger" aria-label="required">*</span>}
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
          type={type}
          value={value}
          maxLength={maxLength}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            helper ? `${id}-helper` : error ? `${id}-error` : showCharCount ? `${id}-char-count` : undefined
          }
          className={`${baseInput} ${Icon ? 'pl-12' : ''} ${RightIcon ? 'pr-12' : ''} ${
            error ? 'border-status-danger ring-status-danger/20' : ''
          } ${inputClassName}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-1 rounded-md p-1 transition-colors"
            aria-label={type === 'password' ? 'Toggle password visibility' : 'Action'}
            tabIndex={-1}
          >
            <RightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        {helper && (
          <p id={`${id}-helper`} className="text-xs text-neutral-500">
            {helper}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs font-medium text-status-danger" role="alert">
            {error}
          </p>
        )}
        {showCharCount && maxLength && (
          <p id={`${id}-char-count`} className="text-xs text-neutral-400 ml-auto">
            {charCount}/{maxLength} characters
          </p>
        )}
      </div>
    </div>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
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
}

export default FormField
