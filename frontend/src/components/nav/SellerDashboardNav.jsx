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

