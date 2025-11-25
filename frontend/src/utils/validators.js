const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const phonePattern = /^\+?[0-9]{10,15}$/
const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const otpPattern = /^\d{6}$/

export const required = (label) => (value) =>
  value !== undefined && value !== null && String(value).trim()
    ? ''
    : `${label} is required.`

export const email = (label = 'Email') => (value) => {
  if (!value) return `${label} is required.`
  return emailPattern.test(String(value).trim()) ? '' : `Enter a valid ${label.toLowerCase()}.`
}

export const optionalEmail = (label = 'Email') => (value) =>
  !value || emailPattern.test(String(value).trim()) ? '' : `Enter a valid ${label.toLowerCase()}.`

export const mobile = (label = 'Mobile number') => (value) => {
  if (!value) return `${label} is required.`
  return phonePattern.test(String(value).replace(/\s+/g, ''))
    ? ''
    : `Enter a valid ${label.toLowerCase()} with country code, for example +919876543210.`
}

export const optionalMobile = (label = 'Mobile number') => (value) =>
  !value || phonePattern.test(String(value).replace(/\s+/g, ''))
    ? ''
    : `Enter a valid ${label.toLowerCase()} with country code.`

export const minLength = (label, min) => (value) =>
  !value || String(value).trim().length >= min ? '' : `${label} must have at least ${min} characters.`

export const optionalMinLength = (label, min) => (value) =>
  !value || String(value).trim().length >= min ? '' : `${label} must have at least ${min} characters.`

export const maxLength = (label, max) => (value) =>
  !value || String(value).trim().length <= max ? '' : `${label} must not exceed ${max} characters.`

export const otp = (label = 'OTP') => (value) => {
  if (!value) return `${label} is required.`
  return otpPattern.test(String(value).trim()) ? '' : `Enter the 6-digit ${label.toLowerCase()}.`
}

export const gst = (label = 'GST number') => (value) => {
  if (!value) return ''
  return gstPattern.test(String(value).trim().toUpperCase())
    ? ''
    : `Enter a valid 15-character ${label.toLowerCase()}, or leave the field blank.`
}

export const positiveNumber = (label) => (value) => {
  if (value === undefined || value === null || value === '') {
    return `${label} is required.`
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? '' : `${label} must be a positive number.`
}

export const integer = (label) => (value) => {
  if (value === undefined || value === null || value === '') {
    return `${label} is required.`
  }
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? '' : `${label} must be a whole number.`
}

export const password = (label = 'Password') => (value) => {
  if (!value) return `${label} is required.`
  const trimmed = String(value)
  const hasMinLen = trimmed.length >= 8
  const hasUpper = /[A-Z]/.test(trimmed)
  const hasLower = /[a-z]/.test(trimmed)
  const hasNumber = /\d/.test(trimmed)

  return hasMinLen && hasUpper && hasLower && hasNumber
    ? ''
    : `${label} must have 8+ characters, including uppercase, lowercase, and a number.`
}

export const numberRange = (minField, maxField, label) => (value, values) => {
  const min = Number(values[minField])
  const max = Number(value)
  if (Number.isNaN(min) || Number.isNaN(max)) return `${label} is required.`
  return max >= min ? '' : `${label} must be higher than the minimum price.`
}

export const characterLimit = (label, min, max) => (value) => {
  if (!value) return `${label} is required.`
  const trimmed = String(value).trim()
  if (trimmed.length < min) return `${label} must have at least ${min} characters.`
  if (trimmed.length > max) return `${label} must not exceed ${max} characters.`
  return ''
}

export const optionalCharacterLimit = (label, max) => (value) =>
  !value || String(value).trim().length <= max ? '' : `${label} must not exceed ${max} characters.`

export const runValidationSchema = (values, schema) => {
  const errors = {}
  Object.entries(schema).forEach(([field, validators = []]) => {
    const fieldValidators = Array.isArray(validators) ? validators : [validators]
    for (const validator of fieldValidators) {
      const message = validator(values[field], values)
      if (message) {
        errors[field] = message
        break
      }
    }
  })

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

export const markAllTouched = (schema) =>
  Object.keys(schema).reduce((acc, key) => {
    acc[key] = true
    return acc
  }, {})
