import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
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

const AdminLogin = () => {
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
        <div className="rounded-[48px] bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.1),0_2px_8px_rgba(15,98,254,0.12),0_4px_16px_rgba(15,98,254,0.08)] overflow-hidden">
          <div className="px-6 pt-4 pb-4 text-center border-b border-neutral-100/80 shadow-[0_1px_0_0_rgba(15,98,254,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-secondary mb-1.5">ADMIN PORTAL</p>
            <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight mt-2">Admin Console Access</h1>
            <p className="text-sm text-neutral-600 font-medium">Monitor users, catalog, and RFQs from a hardened workspace.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100/80 [&>*:first-child]:shadow-[inset_-1px_0_0_0_rgba(15,98,254,0.08)] [&>*:last-child]:shadow-[inset_1px_0_0_0_rgba(15,98,254,0.08)]">
            <div className="p-6 lg:p-7">
              <div className="mb-5">
                <h2 className="text-base font-bold text-neutral-900 mb-1 tracking-tight">Secure login</h2>
                <p className="text-xs text-neutral-600 font-medium">Email + password with downstream MFA challenge.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <FormField
                  id="adminEmail"
                  name="email"
                  label="Work email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                />
                <FormField
                  id="adminPassword"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                />
                <Button type="submit" size="md" className="w-full mt-2">
                  Enter admin panel
                </Button>
              </form>
            </div>

            <div className="p-6 lg:p-7 flex flex-col justify-center">
              <div className="rounded-[36px] bg-white shadow-[0_0_0_1px_rgba(15,98,254,0.08),0_6px_14px_rgba(15,98,254,0.08)] p-6 min-h-[260px] flex flex-col">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-neutral-100/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-primary/5">
                    <Shield className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">Security reminders</h3>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">Applies to all compliance users</p>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-neutral-700 leading-relaxed">
                  <li>• Access only via whitelisted corporate network or VPN.</li>
                  <li>• OTP verification and device checks happen post login.</li>
                  <li>• Every action is logged for audit and anomaly detection.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
