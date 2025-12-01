import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import useFormValidation from '../../hooks/useFormValidation.js'
import { email as emailRule, password as passwordRule } from '../../utils/validators.js'

const initialValues = { email: '', password: '' }
const validationSchema = {
  email: [emailRule('Work email')],
  password: [passwordRule('Password')],
}

const adminIllustration =
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80'

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    setUser?.({ name: values.email, role: 'admin' })
    resetForm()
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex justify-center bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl my-0">
        {/* Main Card - Two Column Layout (Form + Illustration) */}
        <div className="rounded-4xl bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80">
            {/* Left Column - Login Form */}
            <div className="p-6 lg:p-8 lg:min-h-[620px] flex flex-col justify-center">
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Secure login</h2>
                <p className="text-xs text-neutral-600 font-medium">Email + password with downstream MFA challenge.</p>
              </div>

              {/* Login Form */}
              <form className="mt-1 space-y-4 transition-all duration-200 ease-out" onSubmit={handleSubmit} noValidate>
                <FormField
                  id="adminEmail"
                  name="email"
                  label="Work email"
                  type="email"
                  required
                  icon={Mail}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="admin@b2bmarketplace.com"
                  error={errors.email}
                  wrapperClassName="space-y-2"
                />

                <FormField
                  id="adminPassword"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  icon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  Enter admin panel
                </Button>
              </form>
            </div>

            {/* Right Column - B2B Illustration */}
            <div className="relative hidden lg:block">
              <img
                src={adminIllustration}
                alt="B2B admin workspace illustration"
                className="h-full w-full object-cover blur-[1px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-300/35 via-blue-400/15 to-yellow-300/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
