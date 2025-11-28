import { useState } from 'react'
import { User, Building2, MapPin, Phone } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const AdminProfile = () => {
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
    setUser && setUser({ ...(user || {}), [field]: value })
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with backend admin profile API
  }

  const handleLogout = () => {
    setUser?.(null)
    window.location.href = '/'
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-[28px] border border-teal-100 bg-gradient-to-br from-cyan-50/80 via-white to-emerald-50/80 shadow-[0_24px_70px_rgba(15,118,110,0.18)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold">
                {(form.name || user?.name || 'A')[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                  Admin profile
                </p>
                <h1 className="truncate text-xl sm:text-2xl font-semibold leading-snug">
                  {form.name || user?.name || 'Your full name'}
                </h1>
                <p className="truncate text-xs text-emerald-100/90">
                  {form.email || user?.email || 'admin@company.com'}
                </p>
              </div>
            </div>
            <User className="hidden h-8 w-8 text-white/90 opacity-90 sm:block" aria-hidden="true" />
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 px-6 py-4 bg-gradient-to-b from-teal-50/40 via-white to-amber-50/30"
          noValidate
        >
          <FormField
            id="adminProfileName"
            label="Full Name"
            required
            value={form.name}
            onChange={handleChange('name')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
            icon={User}
          />

          <FormField
            id="adminProfileEmail"
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
              id="adminProfilePhone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
            <FormField
              id="adminProfileCompany"
              label="Company Name"
              value={form.company}
              onChange={handleChange('company')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={Building2}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <FormField
              id="adminProfileCity"
              label="City"
              value={form.city}
              onChange={handleChange('city')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={MapPin}
            />
            <FormField
              id="adminProfileCountry"
              label="Country*"
              required
              value={form.country}
              onChange={handleChange('country')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
          </div>

          <FormField
            id="adminProfileNote"
            label="Short Note / Preferences"
            as="textarea"
            rows={3}
            value={form.note}
            onChange={handleChange('note')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
          />

          <div className="mt-1.5 flex flex-col gap-2.5 border-t border-teal-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Your profile helps manage marketplace operations with the right context.
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
              <Button
                type="submit"
                size="sm"
                className="rounded-full px-5 text-xs bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#0EA5E9] text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)] hover:from-[#1D4ED8] hover:to-[#0369A1]"
              >
                Save profile
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AdminProfile


