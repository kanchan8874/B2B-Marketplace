import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import OptimizedImage from '../../components/common/OptimizedImage.jsx'
import { FALLBACK_IMAGES } from '../../constants/images.js'
import useFormValidation from '../../hooks/useFormValidation.js'
import { signup } from '../../services/authService.js'
import {
  email as emailRule,
  gst,
  minLength,
  mobile,
  optionalCharacterLimit,
  password as passwordRule,
  required,
} from '../../utils/validators.js'

const initialValues = {
  sellerBusiness: '',
  sellerAddress: '',
  sellerCity: '',
  sellerPhone: '',
  sellerEmail: '',
  sellerPassword: '',
  sellerGst: '',
}

const validationSchema = {
  sellerBusiness: [required('Business name'), minLength('Business name', 3), optionalCharacterLimit('Business name', 80)],
  sellerAddress: [required('Business address'), minLength('Business address', 5), optionalCharacterLimit('Business address', 120)],
  sellerCity: [required('City / State'), minLength('City / State', 3)],
  sellerPhone: [mobile('Primary mobile')],
  sellerEmail: [emailRule('Official email')],
  sellerPassword: [passwordRule('Password')],
  sellerGst: [gst('GST number')],
}

const SellerSignup = () => {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    if (!validateForm()) return

    setSubmitting(true)
    try {
      // Parse city and state from sellerCity (format: "City, State")
      const cityStateParts = values.sellerCity.split(',').map((s) => s.trim())
      const city = cityStateParts[0] || ''
      const state = cityStateParts[1] || ''

      // Prepare signup data
      const signupData = {
        name: values.sellerBusiness,
        email: values.sellerEmail,
        password: values.sellerPassword,
        role: 'seller',
        companyName: values.sellerBusiness,
        phone: values.sellerPhone,
        location: {
          city: city,
          state: state,
          country: 'India', // Default to India
        },
      }

      const response = await signup(signupData)

      if (response.success) {
        resetForm()
        setSuccessMessage('Seller registered successfully. Please login with your email and password.')
      }
    } catch (error) {
      console.error('Seller signup error:', error)
      setSubmitError(error.message || 'Failed to register. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl my-0">
        {/* Main Card - Two Column Layout (Form + Illustration) */}
        <div className="relative rounded-4xl bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80">
            {/* Left Column - Signup Form */}
            <div className="p-4 sm:p-6 lg:p-8 lg:min-h-[600px] flex flex-col justify-center">
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Seller Registration</h2>
                <p className="text-xs text-neutral-600 font-medium">Submit your business details for approval.</p>
              </div>

              {successMessage && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="alert" aria-live="polite">
                  {successMessage}
                </div>
              )}

              {/* Signup Form */}
              <form className="mt-1 space-y-3.5 transition-all duration-200 ease-out" onSubmit={onSubmit} noValidate>
                <FormField
                  id="sellerBusiness"
                  name="sellerBusiness"
                  label="Business name"
                  required
                  placeholder="Nova Foods Ltd."
                  value={values.sellerBusiness}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerBusiness}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerAddress"
                  name="sellerAddress"
                  label="Business address"
                  required
                  placeholder="Plot 21, MIDC, Pune"
                  value={values.sellerAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerAddress}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerCity"
                  name="sellerCity"
                  label="City / State"
                  required
                  placeholder="Pune, Maharashtra"
                  value={values.sellerCity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerCity}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerPhone"
                  name="sellerPhone"
                  label="Primary mobile"
                  required
                  type="tel"
                  placeholder="+91 9876543210"
                  value={values.sellerPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerPhone}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerEmail"
                  name="sellerEmail"
                  label="Official email"
                  required
                  type="email"
                  placeholder="ops@novafoods.com"
                  value={values.sellerEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerEmail}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerPassword"
                  name="sellerPassword"
                  label="Password"
                  required
                  type="password"
                  placeholder="Create a strong password"
                  value={values.sellerPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerPassword}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="sellerGst"
                  name="sellerGst"
                  label="GST (optional)"
                  placeholder="27ABCDE1234F1Z5"
                  value={values.sellerGst}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellerGst}
                  wrapperClassName="space-y-2"
                />

                {submitError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800" role="alert" aria-live="polite">
                    {submitError}
                  </div>
                )}
                
                <Button type="submit" size="md" className="w-full mt-2" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </form>
            </div>

            {/* Right Column - B2B Illustration */}
            <div className="relative hidden lg:block">
              <OptimizedImage
                src={FALLBACK_IMAGES.authIllustration}
                alt="B2B sellers managing their marketplace presence"
                fallback={FALLBACK_IMAGES.authIllustration}
                className="h-full w-full object-cover blur-[1px]"
                loading="eager"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/35 via-emerald-400/15 to-yellow-300/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerSignup
