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
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 p-5 text-center text-sm text-emerald-800 shadow-[0_14px_40px_rgba(16,185,129,0.16)]">
        <p className="font-semibold">Response recorded for RFQ #{rfqId}.</p>
        <p className="mt-1 text-xs text-neutral-600">
          The buyer will now see your final price and terms in their RFQ center.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
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
        helper="Keep it simple: payment terms, validity of quote, and any key conditions."
      />
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="rounded-full px-5 text-sm"
          onClick={resetForm}
        >
          Clear
        </Button>
        <Button type="submit" size="md" className="rounded-full px-6 text-sm">
          Submit response
        </Button>
      </div>
    </form>
  )
}

RFQResponseForm.propTypes = {
  rfqId: PropTypes.string.isRequired,
}

export default RFQResponseForm
