import PropTypes from 'prop-types'
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import {
  characterLimit,
  minLength,
  positiveNumber,
  required,
} from '../../utils/validators.js'

const initialValues = { finalPrice: '', deliveryTime: '', terms: '' }

const validationSchema = {
  finalPrice: [positiveNumber('Final quoted price')],
  deliveryTime: [required('Delivery timeline'), minLength('Delivery timeline', 3)],
  terms: [characterLimit('Payment and other terms', 15, 500)],
}

const RFQResponseForm = ({ rfqId }) => {
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
      <div className="rounded-3xl border border-brand-secondary/40 bg-brand-secondary/5 p-6 text-center text-brand-secondary">
        Response recorded for RFQ #{rfqId}.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <FormField
        id="finalPrice"
        name="finalPrice"
        label="Final quoted price (₹)"
        required
        type="number"
        value={values.finalPrice}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.finalPrice}
      />
      <FormField
        id="deliveryTime"
        name="deliveryTime"
        label="Delivery timeline"
        required
        value={values.deliveryTime}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., 10 business days"
        error={errors.deliveryTime}
      />
      <FormField
        id="terms"
        name="terms"
        label="Payment & other terms"
        required
        as="textarea"
        rows={4}
        value={values.terms}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.terms}
      />
      <Button type="submit" size="lg" className="w-full">
        Submit response
      </Button>
    </form>
  )
}

RFQResponseForm.propTypes = {
  rfqId: PropTypes.string.isRequired,
}

export default RFQResponseForm
