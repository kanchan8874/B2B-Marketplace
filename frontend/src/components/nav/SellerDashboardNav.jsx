import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const sellerLinks = [
  { label: 'Dashboard', href: '/seller/dashboard' },
  { label: 'My Products', href: '/seller/products' },
  { label: 'Add Product', href: '/seller/products/new' },
  { label: 'RFQs Received', href: '/seller/rfqs' },
  { label: 'Messages', href: '/seller/messages' },
  { label: 'KYC Verification', href: '/seller/kyc' },
]

const linkBaseClasses =
  'relative inline-flex items-center justify-center px-2 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary'

const SellerDashboardNav = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleLogout = () => {
    setUser?.(null)
    navigate('/')
  }

  return (
    <header className="w-full rounded-3xl border border-surface-border bg-white/95 px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:px-6 lg:px-10">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 lg:h-16">
        {/* Left: Logo + title */}
        <div className="flex min-w-0 items-center gap-3">
          <Logo compact />
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-secondary">
              Seller workspace
            </p>
            <p className="truncate text-xs text-neutral-600 sm:text-sm">
              Maintain catalogues and reply to RFQs.
            </p>
          </div>
        </div>

        {/* Center: nav tabs with underline active state */}
        <nav
          className="hidden flex-1 items-center justify-start lg:flex"
          aria-label="Seller dashboard"
        >
          <div className="flex flex-nowrap items-center gap-6">
            {sellerLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => {
                  const activeClasses =
                    'text-brand-primary border-b-2 border-brand-primary pb-1'
                  const inactiveClasses = 'text-neutral-700 hover:text-brand-primary'
                  return `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
                }}
              >
                <span className="px-0.5">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Right: profile button */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative" ref={profileRef}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-3 text-sm font-semibold text-neutral-800 hover:border-brand-primary/60 hover:text-brand-primary max-w-xs"
              onClick={() => navigate('/seller/profile')}
              aria-label="Open seller profile page"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-yellow-400 to-blue-500 text-xs font-semibold uppercase text-white">
                {(user?.name || 'S')[0]}
              </span>
              <span className="hidden text-xs sm:inline-block">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SellerDashboardNav

