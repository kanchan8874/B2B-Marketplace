import PropTypes from 'prop-types'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { characterLimit, minLength, numberRange, positiveNumber, required } from '../../utils/validators.js'

const initialState = {
  name: '',
  description: '',
  priceMin: '',
  priceMax: '',
  moq: '',
  category: '',
  location: '',
}

const validationSchema = {
  name: [required('Product name'), minLength('Product name', 3)],
  category: [required('Category')],
  priceMin: [positiveNumber('Minimum price')],
  priceMax: [positiveNumber('Maximum price'), numberRange('priceMin', 'priceMax', 'Maximum price')],
  moq: [positiveNumber('MOQ')],
  location: [required('City / State'), minLength('City / State', 3)],
  description: [characterLimit('Description', 20, 600)],
}

const ProductForm = ({ onSubmit, submitLabel }) => {
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialState,
    validationSchema,
    { validateOnChange: false },
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    onSubmit?.(values)
    resetForm()
  }

  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <FormField
        id="name"
        name="name"
        label="Product name"
        required
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
      />
      <FormField
        id="category"
        name="category"
        label="Category"
        required
        value={values.category}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Select category"
        error={errors.category}
      />
      <FormField
        id="priceMin"
        name="priceMin"
        label="Price min (₹)"
        required
        type="number"
        value={values.priceMin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.priceMin}
      />
      <FormField
        id="priceMax"
        name="priceMax"
        label="Price max (₹)"
        required
        type="number"
        value={values.priceMax}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.priceMax}
      />
      <FormField
        id="moq"
        name="moq"
        label="MOQ (units)"
        required
        type="number"
        value={values.moq}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.moq}
      />
      <FormField
        id="location"
        name="location"
        label="City / State"
        required
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.location}
      />
      <FormField
        id="description"
        name="description"
        label="Description"
        as="textarea"
        rows={4}
        wrapperClassName="md:col-span-2"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        helper="Add key specifications, packaging, and compliance notes."
      />
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

ProductForm.propTypes = {
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
}

export default ProductForm
