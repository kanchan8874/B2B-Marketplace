import { useEffect, useState } from 'react'
import { User, Building2, MapPin, Phone, Bell } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getProfile, updateProfile } from '../../services/profileService.js'

const BuyerProfile = () => {
  const { user, setUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    city: '',
    state: '',
    country: 'India',
    note: '',
  })

  const [notifications, setNotifications] = useState({
    emailOnNewMessage: true,
    emailOnKycStatus: true,
    emailOnProductModeration: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        const profile = await getProfile()
        if (!isMounted || !profile) return

        setForm((prev) => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          phone: profile.phone || '',
          company: profile.companyName || '',
          city: profile.location?.city || '',
          state: profile.location?.state || '',
          country: profile.location?.country || prev.country,
        }))
        setNotifications((prev) => ({
          ...prev,
          ...(profile.notificationPreferences || {}),
        }))
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError(err.message || 'Failed to load profile.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setSaving(true)
      const payload = {
        name: form.name,
        phone: form.phone || undefined,
        companyName: form.company || undefined,
        location: {
          city: form.city || undefined,
          state: form.state || undefined,
          country: form.country || undefined,
        },
        notificationPreferences: notifications,
      }

      const updated = await updateProfile(payload)
      setUser?.(updated)
      setSuccess('Profile saved successfully.')
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError(err.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
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
          {loading && (
            <p className="mb-1 text-xs text-neutral-500">Loading your profile...</p>
          )}
          {error && (
            <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {error}
            </div>
          )}
          {success && !loading && (
            <div className="mb-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {success}
            </div>
          )}
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
            <FormField
              id="buyerProfileState"
              label="State"
              value={form.state}
              onChange={handleChange('state')}
              wrapperClassName="!space-y-1 text-xs"
              inputClassName="text-sm"
            />
          </div>

          {/* Notification preferences */}
          <div className="mt-2 rounded-2xl border border-blue-100 bg-white/80 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Email notifications
              </p>
            </div>
            <fieldset className="space-y-2" aria-label="Buyer email notification preferences">
              <label className="flex items-center justify-between gap-3 text-xs text-neutral-700">
                <span>New messages from sellers</span>
                <input
                  type="checkbox"
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/30"
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
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/30"
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
                  className="h-4 w-7 cursor-pointer rounded-full border-neutral-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/30"
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
              <Button type="submit" size="sm" className="rounded-full px-5 text-xs" disabled={saving}>
                {saving ? 'Saving...' : 'Save profile'}
              </Button>
            </div>
          </div>
        </form>

      </div>
    </section>
  )
}

export default BuyerProfile


