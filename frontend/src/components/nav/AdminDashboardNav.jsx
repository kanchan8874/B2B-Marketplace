import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { ChevronDown } from 'lucide-react'

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users Management', href: '/admin/users' },
  { label: 'Products Management', href: '/admin/products' },
  { label: 'Category Management', href: '/admin/categories' },
  { label: 'Subscription Management', href: '/admin/subscriptions' },
  { label: 'RFQ Monitor', href: '/admin/rfqs' },
  { label: 'Message Oversight', href: '/admin/messages' },
  { label: 'Seller KYC', href: '/admin/kyc/sellers' },
  { label: 'Buyer KYC', href: '/admin/kyc/buyers' },
]

const linkBaseClasses =
  'relative inline-flex items-center justify-center px-2 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-secondary'

const AdminDashboardNav = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [kycOpen, setKycOpen] = useState(false)
  const kycDropdownRef = useRef(null)

  const desktopLinks = adminLinks.filter(
    (link) => link.href !== '/admin/kyc/sellers' && link.href !== '/admin/kyc/buyers',
  )
  const kycLinks = adminLinks.filter((link) => link.href.startsWith('/admin/kyc/'))
  const isKycActive = location.pathname.startsWith('/admin/kyc')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (kycDropdownRef.current && !kycDropdownRef.current.contains(event.target)) {
        setKycOpen(false)
      }
    }

    if (kycOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [kycOpen])

  const handleProfileClick = () => {
    navigate('/admin/profile')
  }

  return (
    <header className="w-full rounded-3xl border-b border-surface-border bg-gradient-to-r from-white via-blue-50/40 to-emerald-50/40 px-4 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.05)] sm:px-6 lg:px-10">
      {/* Outer shell spans full width inside AppShell */}
      <div className="flex h-14 w-full items-center justify-between gap-6 lg:h-16">
        {/* Left: Logo + title + description */}
        <div className="flex min-w-0 items-center gap-3">
          <Logo compact />
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-secondary">
              Admin Panel
            </p>
            
          </div>
        </div>

        {/* Center: main navigation tabs (single row) */}
        <nav className="hidden flex-1 items-center justify-start lg:flex" aria-label="Admin primary navigation">
          <div className="flex flex-nowrap items-center gap-6">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => {
                  const activeClasses = 'text-brand-secondary border-b-2 border-brand-secondary pb-1'
                  const inactiveClasses = 'text-neutral-700 hover:text-brand-secondary'
                  return `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
                }}
              >
                <span className="px-0.5">{link.label}</span>
              </NavLink>
            ))}

            {/* KYC dropdown for desktop */}
            <div className="relative" ref={kycDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setKycOpen((open) => !open)
                }}
                className={`${linkBaseClasses} ${
                  isKycActive ? 'text-brand-secondary border-b-2 border-brand-secondary pb-1' : 'text-neutral-700'
                }`}
                aria-expanded={kycOpen}
                aria-haspopup="true"
              >
                <span className="px-0.5">KYC</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${kycOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {kycOpen && (
                <div className="absolute left-0 z-40 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white py-2 shadow-[0_12px_30px_rgba(15,23,42,0.15)]">
                  {kycLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      onClick={(e) => {
                        e.stopPropagation()
                        setKycOpen(false)
                      }}
                      className={({ isActive }) =>
                        `flex w-full items-center px-4 py-2 text-sm transition-colors ${
                          isActive ? 'bg-blue-50 text-brand-secondary font-semibold' : 'text-neutral-800 hover:bg-neutral-50'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Right: profile */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-4 py-2 text-xs font-semibold text-neutral-800 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-brand-secondary hover:text-brand-secondary hover:bg-white"
            onClick={handleProfileClick}
            aria-label="Open admin profile"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-emerald-400 to-teal-500 text-xs font-bold uppercase text-white">
              A
            </span>
            <span className="hidden sm:inline-block">Profile</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav (stacked) */}
      <nav
        className="mt-3 flex flex-wrap items-center gap-2 lg:hidden"
        aria-label="Admin primary navigation mobile"
      >
        {adminLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) => {
              const activeClasses =
                'text-brand-secondary border-b-2 border-brand-secondary pb-1'
              const inactiveClasses =
                'text-neutral-700 bg-white/80 hover:text-brand-secondary hover:bg-blue-50/80 border border-neutral-200'
              return `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default AdminDashboardNav

