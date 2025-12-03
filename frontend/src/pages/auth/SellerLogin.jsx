import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Eye, EyeOff, Lock } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { login, sendOtp, verifyOtp } from '../../services/authService.js'
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
  email: [emailRule('Email address')],
  password: [passwordRule('Password')],
}

const phoneOtpSchema = {
  phone: [mobile('Registered mobile')],
  otp: [otpRule('OTP')],
}

const emailOtpSchema = {
  otpEmail: [emailRule('Email address')],
  otp: [otpRule('OTP')],
}

const sellerIllustration =
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80'

const SellerLogin = () => {
  const [mode, setMode] = useState('password')
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [otpForm, setOtpForm] = useState({ ...otpInitial })
  const [emailForm, setEmailForm] = useState({ ...emailInitial })
  const [errors, setErrors] = useState({ ...emptyErrors })
  const [submitting, setSubmitting] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
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

  const validateOtpForm = (nextForm = otpForm) => {
    const schema = getOtpSchema()
    const result = runValidationSchema(nextForm, schema)
    applyErrors(Object.keys(schema), result.errors)
    return result.isValid
  }

  const resetForms = () => {
    setOtpForm({ ...otpInitial })
    setEmailForm({ ...emailInitial })
    setErrors({ ...emptyErrors })
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    resetForms()
    setOtpSent(false)
    setSubmitError('')
  }

  const handleOtpMethodChange = (method) => {
    setOtpDeliveryMethod(method)
    setOtpForm({ ...otpInitial })
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
    setOtpForm((prev) => {
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
    const sourceValues = emailLoginSchema[name] ? emailForm : otpForm
    const result = runValidationSchema(sourceValues, schema)
    applyErrors([name], result.errors)
  }

  const handleSendOtp = async () => {
    setSubmitError('')
    const schema = otpDeliveryMethod === 'phone' ? { phone: phoneOtpSchema.phone } : { otpEmail: emailOtpSchema.otpEmail }
    const result = runValidationSchema(otpForm, schema)
    applyErrors(Object.keys(schema), result.errors)
    if (!result.isValid) return

    setSendingOtp(true)
    try {
      const email = otpDeliveryMethod === 'email' ? otpForm.otpEmail : undefined
      const phone = otpDeliveryMethod === 'phone' ? otpForm.phone : undefined

      await sendOtp(email, phone)
      setOtpSent(true)
      // Clear OTP field for new entry
      setOtpForm((prev) => ({ ...prev, otp: '' }))
    } catch (error) {
      console.error('Send OTP error:', error)
      setSubmitError(error.message || 'Failed to send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    
    if (!validateOtpForm()) return

    setSubmitting(true)
    try {
      const email = otpDeliveryMethod === 'email' ? otpForm.otpEmail : undefined
      const phone = otpDeliveryMethod === 'phone' ? otpForm.phone : undefined

      const response = await verifyOtp(otpForm.otp, email, phone)
      
      // Set user and redirect
      if (response.data?.user && setUser) {
        setTimeout(() => {
          setUser(response.data.user)
          navigate('/seller/dashboard', { replace: true })
        }, 100)
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setSubmitError(error.message || 'Invalid OTP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    
    if (!validateEmailForm()) return

    setSubmitting(true)
    try {
      const response = await login(emailForm.email, emailForm.password)
      
      // Set user and redirect
      if (response.data?.user && setUser) {
        setTimeout(() => {
          setUser(response.data.user)
          navigate('/seller/dashboard', { replace: true })
        }, 100)
      }
    } catch (error) {
      console.error('Login error:', error)
      setSubmitError(error.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl my-0">
        {/* Main Card - Two Column Layout (Form + Illustration) */}
        <div className="rounded-3xl bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80">
            {/* Left Column - Login Form */}
            <div className="p-6 lg:p-8 lg:min-h-[620px] flex flex-col justify-center">
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Secure login</h2>
                <p className="text-xs text-neutral-600 font-medium">Switch between password and OTP modes any time.</p>
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

              {/* OTP Delivery Method Selector - Removed phone option, only email */}

              {/* Forms */}
              {mode === 'otp' ? (
                <form className="space-y-4 transition-all duration-200 ease-out" onSubmit={handleOtpSubmit} noValidate>
                  <FormField
                    id="sellerOtpEmail"
                    name="otpEmail"
                    label="Email Address"
                    type="email"
                    required
                    icon={Mail}
                    value={otpForm.otpEmail}
                    onChange={handleOtpChange}
                    onBlur={handleFieldBlur}
                    placeholder="admin@agrosaf.com"
                    maxLength={60}
                    showCharCount
                    error={errors.otpEmail}
                    disabled={otpSent}
                    helper={otpSent ? "OTP sent! Check your email." : ""}
                    wrapperClassName="space-y-2"
                  />

                  {otpSent && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                      ✓ OTP sent to {otpForm.otpEmail}. Please check your email.
                    </div>
                  )}

                  {submitError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="flex-1" 
                      size="md" 
                      onClick={handleSendOtp}
                      disabled={sendingOtp || otpSent}
                    >
                      {sendingOtp ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      size="md"
                      disabled={submitting || !otpSent}
                    >
                      {submitting ? 'Verifying...' : 'Verify & login'}
                    </Button>
                  </div>

                  <FormField
                    id="sellerOtp"
                    name="otp"
                    label="Enter OTP"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={otpForm.otp}
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
                <form className="space-y-4 transition-all duration-200 ease-out" onSubmit={handleEmailSubmit} noValidate>
                  <FormField
                    id="sellerEmail"
                    name="email"
                    label="Email Address"
                    type="email"
                    required
                    icon={Mail}
                    value={emailForm.email}
                    onChange={handleEmailChange}
                    onBlur={handleFieldBlur}
                    placeholder="admin@agrosaf.com"
                    maxLength={60}
                    showCharCount
                    error={errors.email}
                    wrapperClassName="space-y-2"
                  />

                  <FormField
                    id="sellerPassword"
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
                    maxLength={72}
                    showCharCount
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

                  {submitError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" size="md" className="w-full mt-2" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              )}
            </div>

            {/* Right Column - B2B Seller Illustration */}
            <div className="relative hidden lg:block min-h-[620px] bg-gradient-to-br from-emerald-100 via-blue-50 to-yellow-50">
              <img
                src={sellerIllustration}
                alt="Sellers collaborating on product catalog and RFQs"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-blue-500/15 to-yellow-300/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerLogin
