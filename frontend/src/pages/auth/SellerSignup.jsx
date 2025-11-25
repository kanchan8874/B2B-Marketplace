import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import {
  email as emailRule,
  gst,
  minLength,
  mobile,
  optionalCharacterLimit,
  required,
} from '../../utils/validators.js'

const initialValues = {
  sellerBusiness: '',
  sellerAddress: '',
  sellerCity: '',
  sellerPhone: '',
  sellerEmail: '',
  sellerGst: '',
}

const validationSchema = {
  sellerBusiness: [required('Business name'), minLength('Business name', 3), optionalCharacterLimit('Business name', 80)],
  sellerAddress: [required('Business address'), minLength('Business address', 5), optionalCharacterLimit('Business address', 120)],
  sellerCity: [required('City / State'), minLength('City / State', 3)],
  sellerPhone: [mobile('Primary mobile')],
  sellerEmail: [emailRule('Official email')],
  sellerGst: [gst('GST number')],
}

const SellerSignup = () => {
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
    <section className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-white/40 bg-gradient-to-br from-white via-white to-brand-secondary/5 px-6 py-5 shadow-[0_25px_60px_rgba(15,98,254,0.15)] lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-60 w-60 -translate-x-1/3 rounded-full bg-brand-secondary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 translate-x-1/3 rounded-full bg-brand-primary/10 blur-3xl" />
      </div>
      <div className="relative z-10 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-[32px] border border-white/70 bg-white p-5 shadow-[0_15px_50px_rgba(15,98,254,0.12)] backdrop-blur">
          <form className="space-y-3" onSubmit={onSubmit} noValidate>
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
            />
            <Button type="submit" size="lg" className="w-full rounded-2xl">
              Submit for approval
            </Button>
          </form>
        </div>
        <div
          className="rounded-[36px] border border-transparent bg-cover bg-center shadow-[0_25px_90px_rgba(15,98,254,0.3)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,37,85,0.15), rgba(5,16,50,0.85)), url('https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1100&q=80')",
          }}
        />
      </div>
    </section>
  )
}

export default SellerSignup
