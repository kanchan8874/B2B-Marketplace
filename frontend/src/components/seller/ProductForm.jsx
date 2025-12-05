import PropTypes from 'prop-types'
import { useState } from 'react'
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
  priceValidityDate: '',
  paymentTerms: '',
  shipmentMode: '',
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

const ProductForm = ({ onSubmit, submitLabel, categories = [], initialValues }) => {
  const startingValues = initialValues || initialState
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    startingValues,
    validationSchema,
    { validateOnChange: false },
  )
  const [mediaFiles, setMediaFiles] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    onSubmit?.({ ...values, mediaFiles })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Catalogue Basics
          </p>
          <FormField
            id="name"
            name="name"
            label="Product Name"
            placeholder="e.g., Industrial Safety Helmets"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <FormField
              id="category"
              name="category"
              label="Category"
            required
            as="select"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.category}
          >
            <option value="">Select primary category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </FormField>
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

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Commercials
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <FormField
              id="priceMin"
              name="priceMin"
              label="Price Min (₹)"
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
              label="Price Max (₹)"
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
            label="MOQ (Units)"
            required
            type="number"
            value={values.moq}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.moq}
          />
          <FormField
            id="priceValidityDate"
            name="priceValidityDate"
            label="Price Validity Date"
            type="date"
            value={values.priceValidityDate}
            onChange={handleChange}
            onBlur={handleBlur}
            helper="Price will auto-switch to 'To Be Offered' after this date"
          />
        </div>
      </div>

      {/* Payment Terms & Shipment Mode */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="paymentTerms"
          name="paymentTerms"
          label="Standard Payment Terms"
          as="select"
          value={values.paymentTerms}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select Payment Terms</option>
          <option value="Net 15">Net 15</option>
          <option value="Net 30">Net 30</option>
          <option value="Net 45">Net 45</option>
          <option value="Net 60">Net 60</option>
          <option value="Advance">Advance</option>
          <option value="COD">COD</option>
          <option value="Other">Other</option>
        </FormField>
        <FormField
          id="shipmentMode"
          name="shipmentMode"
          label="Standard Shipment Mode"
          as="select"
          value={values.shipmentMode}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select Shipment Mode</option>
          <option value="Road">Road</option>
          <option value="Rail">Rail</option>
          <option value="Air">Air</option>
          <option value="Sea">Sea</option>
          <option value="Express">Express</option>
          <option value="Other">Other</option>
        </FormField>
      </div>

      <FormField
        id="description"
        name="description"
        label="Product Description"
        as="textarea"
        rows={4}
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        helper="Highlight specifications, certifications, and packaging in 2–4 crisp lines."
      />

      <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Inventory & Logistics
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <FormField
              id="sku"
              name="sku"
              label="SKU (Internal)"
              placeholder="Optional — for your tracking"
              value={values.sku}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormField
              id="stock"
              name="stock"
              label="Available Stock"
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
            label="Dispatch City / State"
            placeholder="e.g., Ahmedabad, Gujarat"
            required
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.location}
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Media Upload
          </p>
          <MediaUploader onChange={setMediaFiles} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-neutral-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="rounded-full px-6 w-full sm:w-auto"
          onClick={resetForm}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="rounded-full px-8 w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

ProductForm.propTypes = {
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
}

export default ProductForm
