import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { createRFQ } from '../../services/rfqService.js'
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

const RFQForm = ({ product }) => {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    if (!validateForm()) return

    if (!product?._id || !product?.seller?._id) {
      setSubmitError('Product or seller information is missing.')
      return
    }

    setSubmitting(true)
    try {
      // Parse delivery location into city/state/country
      const parts = values.location.split(',').map((p) => p.trim())
      const city = parts[0] || values.location
      const state = parts[1] || parts[0] || values.location
      const country = parts[2] || 'India'

      await createRFQ({
        product: product._id,
        seller: product.seller._id,
        quantity: Number(values.quantity),
        deliveryLocation: {
          city,
          state,
          country,
        },
        // notes can be added later to schema if needed
      })

      setSubmitted(true)
      resetForm()
    } catch (error) {
      console.error('Failed to create RFQ:', error)
      setSubmitError(error.message || 'Failed to send RFQ. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-3xl border border-status-success/50 bg-status-success/5 p-6 text-center text-status-success">
        <p className="font-semibold">RFQ sent successfully. The seller will reach out shortly.</p>
        <Button
          size="md"
          variant="secondary"
          className="rounded-full"
          onClick={() => navigate('/buyer/rfqs')}
        >
          View all RFQs
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-label={`Send RFQ for ${product?.name || 'product'}`} noValidate>
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
      {submitError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      )}
      <Button type="submit" size="lg" className="w-full">
        {submitting ? 'Sending...' : 'Send RFQ'}
      </Button>
    </form>
  )
}

RFQForm.propTypes = {
  productName: PropTypes.string.isRequired,
}

export default RFQForm
