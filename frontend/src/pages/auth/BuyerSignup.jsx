import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { gst, minLength, mobile, optionalCharacterLimit, required, email as emailRule } from '../../utils/validators.js'

const initialValues = {
  buyerName: '',
  contactName: '',
  email: '',
  phone: '',
  gst: '',
}

const validationSchema = {
  buyerName: [required('Business name'), minLength('Business name', 3), optionalCharacterLimit('Business name', 80)],
  contactName: [required('Contact person name'), minLength('Contact person name', 2)],
  email: [emailRule('Work email')],
  phone: [mobile('Mobile number')],
  gst: [gst('GST number')],
}

const buyerIllustration =
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80'

const BuyerSignup = () => {
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    resetForm()
  }

  return (
    <div className="flex justify-center bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl my-0">
        {/* Main Card - Two Column Layout (Form + Illustration) */}
        <div className="rounded-4xl bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80">
            {/* Left Column - Signup Form */}
            <div className="p-6 lg:p-8 lg:min-h-[620px] flex flex-col justify-center">
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Create buyer account</h2>
                <p className="text-xs text-neutral-600 font-medium">Fill in your business details to get started.</p>
              </div>

              {/* Signup Form */}
              <form className="mt-1 space-y-4 transition-all duration-200 ease-out" onSubmit={onSubmit} noValidate>
                <FormField
                  id="buyerName"
                  name="buyerName"
                  label="Business name"
                  required
                  placeholder="Acme Retail Pvt. Ltd."
                  value={values.buyerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.buyerName}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="contactName"
                  name="contactName"
                  label="Contact person"
                  required
                  placeholder="Riya Patel"
                  value={values.contactName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.contactName}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="email"
                  name="email"
                  label="Work email"
                  required
                  type="email"
                  placeholder="riya@acme.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="phone"
                  name="phone"
                  label="Mobile (OTP login)"
                  required
                  type="tel"
                  placeholder="+91 9876543210"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  wrapperClassName="space-y-2"
                />
                <FormField
                  id="gst"
                  name="gst"
                  label="GST Number (optional)"
                  placeholder="27ABCDE1234F1Z5"
                  value={values.gst}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.gst}
                  wrapperClassName="space-y-2"
                />
                <Button type="submit" size="md" className="w-full mt-2">
                  Create buyer account
                </Button>
              </form>
            </div>

            {/* Right Column - B2B Illustration */}
            <div className="relative hidden lg:block">
              <img
                src={buyerIllustration}
                alt="B2B buyers collaborating in a digital marketplace workspace"
                className="h-full w-full object-cover blur-[1px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/35 via-emerald-400/15 to-yellow-300/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerSignup
