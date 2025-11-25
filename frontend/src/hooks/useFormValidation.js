import { useState } from 'react'
import { markAllTouched, runValidationSchema } from '../utils/validators.js'

const defaultOptions = { validateOnChange: true }

export const useFormValidation = (initialValues, schema, options = defaultOptions) => {
  const mergedOptions = { ...defaultOptions, ...options }
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (name, nextValues = values) => {
    const { errors: nextErrors } = runValidationSchema(nextValues, { [name]: schema[name] })
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }))
    return !nextErrors[name]
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (mergedOptions.validateOnChange || touched[name]) {
        validateField(name, next)
      }
      return next
    })
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name)
  }

  const validateForm = () => {
    const result = runValidationSchema(values, schema)
    setErrors(result.errors)
    setTouched((prev) => ({ ...prev, ...markAllTouched(schema) }))
    return result.isValid
  }

  const setFieldValue = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (mergedOptions.validateOnChange || touched[name]) {
        validateField(name, next)
      }
      return next
    })
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    setValues,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    setFieldValue,
    resetForm,
    setErrors,
    setTouched,
  }
}

export default useFormValidation

