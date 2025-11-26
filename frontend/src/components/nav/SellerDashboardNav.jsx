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
]

const linkClasses =
  'rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/80 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40'

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
    <header className="rounded-[32px] border border-surface-border bg-white/90 px-4 py-3 shadow-[0_12px_35px_rgba(15,98,254,0.08)] sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Logo compact />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">Seller workspace</p>
            <p className="text-sm text-neutral-500">Maintain catalogues and reply to RFQs.</p>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Seller dashboard">
            {sellerLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-neutral-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="relative" ref={profileRef}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-3 text-sm font-semibold text-neutral-800 hover:border-brand-primary/60 hover:text-brand-primary max-w-xs"
              onClick={() => setProfileOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={profileOpen}
              aria-label="Open seller profile menu"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-yellow-400 to-blue-500 text-xs font-semibold uppercase text-white">
                {(user?.name || 'S')[0]}
              </span>
              <span className="hidden text-xs sm:inline-block">Profile</span>
            </Button>

            {profileOpen && (
              <div
                className="absolute right-0 z-30 mt-3 w-80 rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                role="dialog"
                aria-label="Seller profile menu"
              >
                <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-yellow-400 to-blue-500 text-sm font-semibold uppercase text-white">
                    {(user?.name || 'S')[0]}
                  </div>
                  <div>
                    <p className="truncate text-sm font-semibold text-neutral-900 leading-tight">
                      {user?.name || 'seller@atlas.trade'}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">Seller · Atlas Trade</p>
                  </div>
                </div>

                <div className="space-y-1.5 px-4 py-3 text-xs text-neutral-600">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-neutral-800">Role:</span> Seller
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-neutral-800">Workspace:</span> Catalogues & RFQs
                  </p>
                </div>

                <div className="border-t border-neutral-100 px-4 py-3">
                  <Button
                    type="button"
                    size="sm"
                    className="flex w-full items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white hover:bg-brand-primary/90"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SellerDashboardNav

