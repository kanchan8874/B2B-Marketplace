import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Button from './Button.jsx'
import Logo from './Logo.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const navItems = [
  { label: 'Buyer Login', href: '/auth/buyer/login' },
  { label: 'Seller Login', href: '/auth/seller/login' },
  { label: 'Admin Login', href: '/auth/admin/login' },
]

const registerOptions = [
  { label: 'Buyer Registration', href: '/auth/buyer/signup' },
  { label: 'Seller Registration', href: '/auth/seller/signup' },
]

const Header = () => {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (user) return null

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" aria-label="B2B marketplace home" className="flex items-center gap-2">
          <Logo />
          <div className="flex flex-col leading-tight">
            <p className="text-xs font-light uppercase tracking-[0.35em] text-neutral-600">Premium</p>
            <p className="text-sm font-semibold text-neutral-900">Marketplace</p>
          </div>
        </NavLink>
        <div className="flex items-center gap-3">
          <nav aria-label="Primary authentication links" className="flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const baseClasses =
                'min-w-[140px] justify-center rounded-[14px] px-6 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

              let toneClasses = ''

              if (item.label === 'Buyer Login') {
                // Hero CTA style – solid blue
                toneClasses = isActive
                  ? 'bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.45)] hover:bg-[#1D4ED8]'
                  : 'bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8]'
              } else if (item.label === 'Seller Login') {
                // Hero CTA style – teal gradient
                toneClasses = isActive
                  ? 'bg-gradient-to-r from-[#20B2AA] to-[#008B8B] text-white shadow-[0_8px_20px_rgba(32,178,170,0.45)] hover:from-[#1CA59D] hover:to-[#007A7A]'
                  : 'bg-gradient-to-r from-[#20B2AA] to-[#008B8B] text-white shadow-sm hover:from-[#1CA59D] hover:to-[#007A7A]'
              } else if (item.label === 'Admin Login') {
                // Softer amber/orange
                toneClasses = isActive
                  ? 'bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#FBBF24] text-slate-900 shadow-[0_8px_20px_rgba(250,224,120,0.45)] hover:from-[#FACC15] hover:to-[#F59E0B]'
                  : 'bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#FBBF24] text-slate-900 shadow-sm hover:from-[#FACC15] hover:to-[#F59E0B]'
              }

              return (
                <Button
                  key={item.href}
                  as={NavLink}
                  to={item.href}
                  variant="ghost"
                  size="md"
                  className={`${baseClasses} ${toneClasses}`}
                >
                  {item.label}
                </Button>
              )
            })}
          </nav>
          <div className="relative" ref={menuRef}>
            <Button
              type="button"
              variant="outline"
              size="md"
              className={`min-w-[140px] rounded-[18px] px-6 text-sm font-semibold ${
                menuOpen
                  ? 'bg-white text-[#2563EB] border-[#2563EB]'
                  : 'text-[#2563EB] border-[#2563EB]/80 hover:border-[#2563EB] hover:bg-[#2563EB]/6 shadow-sm hover:shadow-md'
              }`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Register
            </Button>
            {menuOpen && (
              <div
                role="menu"
                aria-label="Registration options"
                className="absolute right-0 mt-2.5 w-[220px] rounded-lg bg-white border border-neutral-200/60 shadow-[0_4px_16px_rgba(15,23,42,0.12)] overflow-hidden"
              >
                {registerOptions.map((option, index) => (
                  <NavLink
                    key={option.href}
                    to={option.href}
                    role="menuitem"
                    tabIndex={0}
                    className={`block w-full px-5 py-3.5 text-center text-sm font-medium text-neutral-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary/30 focus-visible:bg-neutral-50 ${
                      index === 0 ? 'border-b border-neutral-100' : ''
                    } hover:bg-neutral-50 active:bg-neutral-100`}
                    onClick={() => setMenuOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setMenuOpen(false)
                        window.location.href = option.href
                      }
                      if (e.key === 'Escape') {
                        setMenuOpen(false)
                      }
                    }}
                  >
                    {option.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
