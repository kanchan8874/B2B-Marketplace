import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Eye, EyeOff, Lock } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import {
  email as emailRule,
  mobile,
  otp as otpRule,
  password as passwordRule,
  runValidationSchema,
} from '../../utils/validators.js'

const emptyErrors = { email: '', password: '', phone: '', otp: '', otpEmail: '' }
const emailInitial = { email: '', password: '' }
const otpInitial = { phone: '', otpEmail: '', otp: '' }

const emailLoginSchema = {
  email: [emailRule('Work email')],
  password: [passwordRule('Password')],
}

const phoneOtpSchema = {
  phone: [mobile('Mobile number')],
  otp: [otpRule('OTP')],
}

const emailOtpSchema = {
  otpEmail: [emailRule('Email address')],
  otp: [otpRule('OTP')],
}

const buyerIllustration =
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80'

const BuyerLogin = () => {
  const [mode, setMode] = useState('password')
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [emailForm, setEmailForm] = useState({ ...emailInitial })
  const [mobileForm, setMobileForm] = useState({ ...otpInitial })
  const [errors, setErrors] = useState({ ...emptyErrors })
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const applyErrors = (fields, fieldErrors = {}) => {
    setErrors((prev) => {
      const next = { ...prev }
      fields.forEach((field) => {
        next[field] = fieldErrors[field] ?? ''
      })
      return next
    })
  }

  const getOtpSchema = () => (otpDeliveryMethod === 'phone' ? phoneOtpSchema : emailOtpSchema)

  const validateEmailForm = (nextForm = emailForm) => {
    const result = runValidationSchema(nextForm, emailLoginSchema)
    applyErrors(Object.keys(emailLoginSchema), result.errors)
    return result.isValid
  }

  const validateOtpForm = (nextForm = mobileForm) => {
    const schema = getOtpSchema()
    const result = runValidationSchema(nextForm, schema)
    applyErrors(Object.keys(schema), result.errors)
    return result.isValid
  }

  const resetForms = () => {
    setEmailForm({ ...emailInitial })
    setMobileForm({ ...otpInitial })
    setErrors({ ...emptyErrors })
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    resetForms()
  }

  const handleOtpMethodChange = (method) => {
    setOtpDeliveryMethod(method)
    setMobileForm({ ...otpInitial })
    setErrors({ ...emptyErrors })
  }

  const handleEmailChange = (event) => {
    const { name, value } = event.target
    setEmailForm((prev) => {
      const next = { ...prev, [name]: value }
      if (errors[name]) {
        const result = runValidationSchema(next, { [name]: emailLoginSchema[name] })
        applyErrors([name], result.errors)
      }
      return next
    })
  }

  const handleOtpChange = (event) => {
    const { name, value } = event.target
    setMobileForm((prev) => {
      const next = { ...prev, [name]: value }
      const schema = getOtpSchema()
      if (schema[name] && errors[name]) {
        const result = runValidationSchema(next, { [name]: schema[name] })
        applyErrors([name], result.errors)
      }
      return next
    })
  }

  const handleFieldBlur = (event) => {
    const { name } = event.target
    const schema = emailLoginSchema[name]
      ? { [name]: emailLoginSchema[name] }
      : getOtpSchema()[name]
        ? { [name]: getOtpSchema()[name] }
        : null

    if (!schema) return
    const sourceValues = emailLoginSchema[name] ? emailForm : mobileForm
    const result = runValidationSchema(sourceValues, schema)
    applyErrors([name], result.errors)
  }

  const handleSendOtp = () => {
    const schema = otpDeliveryMethod === 'phone' ? { phone: phoneOtpSchema.phone } : { otpEmail: emailOtpSchema.otpEmail }
    const result = runValidationSchema(mobileForm, schema)
    applyErrors(Object.keys(schema), result.errors)
    if (!result.isValid) return
  }

  const handleOtpSubmit = (event) => {
    event.preventDefault()
    if (!validateOtpForm()) return
    const identifier = otpDeliveryMethod === 'phone' ? mobileForm.phone : mobileForm.otpEmail
    handleSuccess(identifier)
    resetForms()
  }

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    if (!validateEmailForm()) return
    handleSuccess(emailForm.email)
    resetForms()
  }

  const handleSuccess = (name = 'Procurement Lead') => {
    setUser?.({ name, role: 'buyer' })
    navigate('/buyer/dashboard')
  }

  return (
    <div className="flex justify-center bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl my-0">
        {/* Main Card - Two Column Layout (Form + Illustration) */}
        <div className="rounded-[40px] bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80">
            {/* Left Column - Login Form */}
            <div className="p-6 lg:p-8 lg:min-h-[600px] flex flex-col justify-center">
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Secure login</h2>
                <p className="text-xs text-neutral-600 font-medium">Choose password or OTP login for this session.</p>
              </div>

              {/* Login Method Selector - Premium Tabs */}
              <div className="mb-5 flex rounded-xl bg-neutral-100/60 p-1.5">
                {[
                  { id: 'password', label: 'Password' },
                  { id: 'otp', label: 'OTP' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleModeChange(option.id)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out ${
                      mode === option.id
                        ? 'bg-white text-brand-primary shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                    }`}
                    aria-pressed={mode === option.id}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* OTP Delivery Method Selector */}
              {mode === 'otp' && (
                <div className="mb-5 transition-all duration-200 ease-out">
                  <p className="mb-2.5 text-xs font-semibold text-neutral-800 tracking-tight">Choose OTP Delivery Method</p>
                  <div className="flex rounded-xl bg-neutral-100/60 p-1.5">
                    {[
                      { id: 'phone', label: 'Phone', icon: Phone },
                      { id: 'email', label: 'Email', icon: Mail },
                    ].map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOtpMethodChange(option.id)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out ${
                            otpDeliveryMethod === option.id
                              ? 'bg-white text-brand-primary shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                          }`}
                          aria-pressed={otpDeliveryMethod === option.id}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Forms */}
              {mode === 'otp' ? (
                <form className="space-y-4 transition-all duration-200 ease-out" onSubmit={handleOtpSubmit} noValidate>
                  {otpDeliveryMethod === 'phone' ? (
                    <FormField
                      id="buyerPhone"
                      name="phone"
                      label="Mobile number"
                      type="tel"
                      required
                      icon={Phone}
                      value={mobileForm.phone}
                      onChange={handleOtpChange}
                      onBlur={handleFieldBlur}
                      placeholder="+91 9876543210"
                      helper="We will send a one-time code."
                      error={errors.phone}
                      wrapperClassName="space-y-2"
                    />
                  ) : (
                    <FormField
                      id="buyerOtpEmail"
                      name="otpEmail"
                      label="Email Address"
                      type="email"
                      required
                      icon={Mail}
                      value={mobileForm.otpEmail}
                      onChange={handleOtpChange}
                      onBlur={handleFieldBlur}
                      placeholder="riya@acme.com"
                      helper="We will send a one-time code."
                      error={errors.otpEmail}
                      wrapperClassName="space-y-2"
                    />
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" className="flex-1" size="md" onClick={handleSendOtp}>
                      Send OTP
                    </Button>
                    <Button type="submit" className="flex-1" size="md">
                      Verify & sign in
                    </Button>
                  </div>

                  <FormField
                    id="buyerOtp"
                    name="otp"
                    label="Enter OTP"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={mobileForm.otp}
                    onChange={(event) =>
                      handleOtpChange({
                        target: { name: 'otp', value: event.target.value.replace(/\D/g, '') },
                      })
                    }
                    onBlur={handleFieldBlur}
                    placeholder="......"
                    maxLength={6}
                    error={errors.otp}
                    wrapperClassName="space-y-2"
                  />
                </form>
              ) : (
                <form className="mt-1 space-y-4 transition-all duration-200 ease-out" onSubmit={handleEmailSubmit} noValidate>
                  <FormField
                    id="buyerEmail"
                    name="email"
                    label="Work email"
                    type="email"
                    required
                    icon={Mail}
                    value={emailForm.email}
                    onChange={handleEmailChange}
                    onBlur={handleFieldBlur}
                    placeholder="riya@acme.com"
                    error={errors.email}
                    wrapperClassName="space-y-2"
                  />

                  <FormField
                    id="buyerPassword"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    icon={Lock}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                    value={emailForm.password}
                    onChange={handleEmailChange}
                    onBlur={handleFieldBlur}
                    placeholder="Enter your password"
                    error={errors.password}
                    wrapperClassName="space-y-2"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/20 cursor-pointer transition-all duration-200 hover:border-brand-primary"
                      />
                      <span className="text-sm text-neutral-700 font-medium group-hover:text-neutral-900 transition-colors">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm font-semibold text-brand-primary hover:text-brand-primary/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-2 rounded-lg transition-all duration-200 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" size="md" className="w-full mt-2">
                    Sign in
                  </Button>
                </form>
              )}
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

export default BuyerLogin
