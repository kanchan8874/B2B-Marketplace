import PropTypes from 'prop-types'
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import {
  integer,
  minLength,
  optionalCharacterLimit,
  optionalMinLength,
  required,
} from '../../utils/validators.js'

const initialValues = { quantity: '', location: '', notes: '' }

const validationSchema = {
  quantity: [integer('Required quantity')],
  location: [required('Delivery location'), minLength('Delivery location', 3)],
  notes: [optionalMinLength('Additional notes', 10), optionalCharacterLimit('Additional notes', 400)],
}

const RFQForm = ({ productName }) => {
  const [submitted, setSubmitted] = useState(false)
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    setSubmitted(true)
    resetForm()
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-status-success/50 bg-status-success/5 p-6 text-center text-status-success">
        RFQ sent successfully. The seller will reach out shortly.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-label={`Send RFQ for ${productName}`} noValidate>
      <FormField
        id="quantity"
        name="quantity"
        label="Required quantity"
        required
        type="number"
        value={values.quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        helper="Specify total units or weight"
        error={errors.quantity}
      />
      <FormField
        id="location"
        name="location"
        label="Delivery location"
        required
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="City, State or Pincode"
        error={errors.location}
      />
      <FormField
        id="notes"
        name="notes"
        label="Additional notes"
        as="textarea"
        rows={4}
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        helper="Mention delivery timelines, packaging, quality specs"
        error={errors.notes}
      />
      <Button type="submit" size="lg" className="w-full">
        Send RFQ
      </Button>
    </form>
  )
}

RFQForm.propTypes = {
  productName: PropTypes.string.isRequired,
}

export default RFQForm
