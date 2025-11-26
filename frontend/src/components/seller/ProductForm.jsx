import PropTypes from 'prop-types'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { characterLimit, minLength, numberRange, positiveNumber, required } from '../../utils/validators.js'
import MediaUploader from './MediaUploader.jsx'

const initialState = {
  name: '',
  description: '',
  priceMin: '',
  priceMax: '',
  moq: '',
  category: '',
  location: '',
  sku: '',
  stock: '',
  subcategory: '',
}

const validationSchema = {
  name: [required('Product name'), minLength('Product name', 3)],
  category: [required('Category')],
  priceMin: [positiveNumber('Minimum price')],
  priceMax: [positiveNumber('Maximum price'), numberRange('priceMin', 'priceMax', 'Maximum price')],
  moq: [positiveNumber('MOQ')],
  location: [required('City / State'), minLength('City / State', 3)],
  description: [characterLimit('Description', 20, 600)],
  stock: [positiveNumber('Available stock')],
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
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Catalogue basics
          </p>
          <FormField
            id="name"
            name="name"
            label="Product name"
            placeholder="e.g. Industrial Safety Helmets"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              id="category"
              name="category"
              label="Category"
              required
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Select primary category"
              error={errors.category}
            />
            <FormField
              id="subcategory"
              name="subcategory"
              label="Subcategory"
              placeholder="Optional — e.g. Safety gear"
              value={values.subcategory}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Commercials
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
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
        </div>
      </div>

      <FormField
        id="description"
        name="description"
        label="Product description"
        as="textarea"
        rows={4}
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        helper="Highlight specifications, certifications, and packaging in 2–4 crisp lines."
      />

      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Inventory & logistics
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="sku"
              name="sku"
              label="SKU (internal)"
              placeholder="Optional — for your tracking"
              value={values.sku}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormField
              id="stock"
              name="stock"
              label="Available stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.stock}
            />
          </div>
          <FormField
            id="location"
            name="location"
            label="Dispatch city / state"
            placeholder="e.g. Ahmedabad, Gujarat"
            required
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.location}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Media upload
          </p>
          <MediaUploader />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="rounded-full px-6"
          onClick={resetForm}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="rounded-full px-8">
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
