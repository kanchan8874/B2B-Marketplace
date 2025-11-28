import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Building2, MapPin, Phone } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const BuyerProfile = () => {
  const { user, setUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    city: '',
    country: 'India',
    note: '',
  })

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: wire up to backend profile API
    setUser?.({ ...(user || {}), name: form.name, email: form.email })
  }

  const handleLogout = () => {
    setUser?.(null)
    window.location.href = '/'
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 shadow-[0_20px_60px_rgba(15,98,254,0.22)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold">
                {(form.name || user?.name || 'B')[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                  Buyer profile
                </p>
                <h1 className="truncate text-xl font-semibold leading-snug">
                  {form.name || user?.name || 'Your full name'}
                </h1>
                <p className="truncate text-xs text-blue-100">
                  {form.email || user?.email || 'buyer@company.com'}
                </p>
              </div>
            </div>
            <User className="hidden h-8 w-8 opacity-80 sm:block" aria-hidden="true" />
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 px-6 py-4 bg-gradient-to-b from-blue-50/40 via-white to-blue-50/30"
          noValidate
        >
          <FormField
            id="buyerProfileName"
            label="Full name"
            required
            value={form.name}
            onChange={handleChange('name')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
            icon={User}
          />

          <FormField
            id="buyerProfileEmail"
            label="Work Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange('email')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <FormField
              id="buyerProfilePhone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={Phone}
            />
            <FormField
              id="buyerProfileCompany"
              label="Company Name"
              value={form.company}
              onChange={handleChange('company')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={Building2}
            />
            <FormField
              id="buyerProfileCity"
              label="City"
              value={form.city}
              onChange={handleChange('city')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={MapPin}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <FormField
              id="buyerProfileCountry"
              label="Country*"
              required
              value={form.country}
              onChange={handleChange('country')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
            <FormField
              id="buyerProfileNote"
              label="Short Note / Preferences"
              as="textarea"
              rows={3}
              value={form.note}
              onChange={handleChange('note')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
          </div>

          <div className="mt-1.5 flex flex-col gap-2.5 border-t border-blue-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Your profile helps suppliers understand your company context for RFQs.
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full px-4 text-xs"
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Button type="submit" size="sm" className="rounded-full px-5 text-xs">
                Save profile
              </Button>
            </div>
          </div>
        </form>

      </div>
    </section>
  )
}

export default BuyerProfile


