import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Building2, MapPin, Phone, Bell } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import VerifiedBadge from '../../components/common/VerifiedBadge.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getSellerKYC } from '../../services/kycService.js'

const SellerProfile = () => {
  const { user, setUser } = useAuth()
  const [isVerified, setIsVerified] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    city: '',
    country: 'India',
    note: '',
  })

  const [notifications, setNotifications] = useState({
    emailOnNewMessage: true,
    emailOnKycStatus: true,
    emailOnProductModeration: true,
  })

  useEffect(() => {
    // Check verification status
    const checkVerification = async () => {
      try {
        const response = await getSellerKYC()
        if (response.data && response.data.status === 'Approved') {
          setIsVerified(true)
        }
      } catch (error) {
        console.error('Failed to check verification status:', error)
      }
    }
    if (user?.role === 'seller') {
      checkVerification()
    }
  }, [user])

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setUser && setUser({ ...(user || {}), [field]: value })
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: integrate with backend seller profile API
    setUser?.({
      ...(user || {}),
      name: form.name,
      email: form.email,
      notificationPreferences: notifications,
    })
  }

  const handleLogout = () => {
    setUser?.(null)
    window.location.href = '/'
  }

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 shadow-[0_20px_60px_rgba(16,185,129,0.22)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold">
                {(form.name || user?.name || 'S')[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                  Seller profile
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl sm:text-2xl font-semibold leading-snug">
                    {form.name || user?.name || 'Your full name'}
                  </h1>
                  {isVerified && (
                    <div className="flex-shrink-0">
                      <VerifiedBadge size="sm" className="text-white" />
                    </div>
                  )}
                </div>
                <p className="truncate text-xs text-emerald-100">
                  {form.email || user?.email || 'seller@company.com'}
                </p>
              </div>
            </div>
            <User className="hidden h-8 w-8 opacity-80 sm:block" aria-hidden="true" />
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 px-6 py-4 bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30"
          noValidate
        >
          <FormField
            id="sellerProfileName"
            label="Full Name"
            required
            value={form.name}
            onChange={handleChange('name')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
            icon={User}
          />

          <FormField
            id="sellerProfileEmail"
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
              id="sellerProfilePhone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
            <FormField
              id="sellerProfileCompany"
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
              id="sellerProfileCity"
              label="City"
              value={form.city}
              onChange={handleChange('city')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
              icon={MapPin}
            />
            <FormField
              id="sellerProfileCountry"
              label="Country*"
              required
              value={form.country}
              onChange={handleChange('country')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
          </div>

          <FormField
            id="sellerProfileNote"
            label="Short Note / Preferences"
            as="textarea"
            rows={3}
            value={form.note}
            onChange={handleChange('note')}
            wrapperClassName="!space-y-1 text-xs"
            inputClassName="text-sm"
          />

          {/* Notification preferences */}
          <div className="mt-2 rounded-2xl border border-emerald-100 bg-white/80 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Email notifications
              </p>
            </div>
            <fieldset className="space-y-2" aria-label="Seller email notification preferences">
              <label className="flex items-center justify-between gap-3 text-xs text-neutral-700">
                <span>New messages from buyers</span>
                <input
                  type="checkbox"
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-400/40"
                  checked={notifications.emailOnNewMessage}
                  onChange={(e) =>
                    setNotifications((prev) => ({ ...prev, emailOnNewMessage: e.target.checked }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs text-neutral-700">
                <span>KYC status updates</span>
                <input
                  type="checkbox"
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-400/40"
                  checked={notifications.emailOnKycStatus}
                  onChange={(e) =>
                    setNotifications((prev) => ({ ...prev, emailOnKycStatus: e.target.checked }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs text-neutral-700">
                <span>Product approval & moderation</span>
                <input
                  type="checkbox"
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-400/40"
                  checked={notifications.emailOnProductModeration}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailOnProductModeration: e.target.checked,
                    }))
                  }
                />
              </label>
            </fieldset>
          </div>

          <div className="mt-1.5 flex flex-col gap-2.5 border-t border-emerald-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              Your profile helps buyers understand your capabilities and how you operate.
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
                className="rounded-full px-5 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
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

export default SellerProfile


