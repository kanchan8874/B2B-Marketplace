import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { gst, minLength, mobile, optionalCharacterLimit, required, email as emailRule } from '../../utils/validators.js'
import { CheckCircle2 } from 'lucide-react'

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

const insightItems = [
  'Single review with compliance-ready fields',
  'Mobile + email verification flows supported',
  'Immediate access to curated supplier catalogues',
]

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
    <section className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-white/40 bg-gradient-to-br from-white via-white to-brand-primary/5 px-6 py-5 shadow-[0_25px_60px_rgba(15,98,254,0.15)] lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-4 h-52 w-52 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-brand-secondary/10 blur-3xl" />
      </div>
      <div className="relative z-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 rounded-[32px] border border-white/70 bg-white p-5 shadow-[0_15px_50px_rgba(15,98,254,0.12)] backdrop-blur">
          <form className="space-y-3" onSubmit={onSubmit} noValidate>
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
          />
          <Button type="submit" size="lg" className="w-full rounded-2xl">
            Create buyer account
          </Button>
        </form>
        </div>

        <div
          className="rounded-[36px] border border-transparent bg-cover bg-center shadow-[0_25px_80px_rgba(15,98,254,0.35)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,37,85,0.15), rgba(5,16,50,0.85)), url('https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1100&q=80')",
          }}
        />
      </div>
    </section>
  )
}

export default BuyerSignup
