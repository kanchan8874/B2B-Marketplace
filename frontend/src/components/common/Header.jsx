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
              let buttonClasses = 'min-w-[140px] justify-center rounded-2xl text-sm font-semibold transition-all duration-300'

              if (item.label === 'Buyer Login') {
                // Blue gradient for Buyer Login
                buttonClasses += isActive
                  ? ' bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] scale-100'
                  : ' bg-white text-[#2563EB] border-2 border-[#2563EB]/20 hover:border-[#2563EB] hover:bg-[#2563EB]/5 shadow-sm hover:shadow-md'
              } else if (item.label === 'Seller Login') {
                // Teal/Green gradient for Seller Login
                buttonClasses += isActive
                  ? ' bg-gradient-to-r from-[#20B2AA] to-[#008B8B] text-white shadow-[0_4px_16px_rgba(32,178,170,0.4)] hover:shadow-[0_6px_20px_rgba(32,178,170,0.5)] scale-100'
                  : ' bg-white text-[#20B2AA] border-2 border-[#20B2AA]/20 hover:border-[#20B2AA] hover:bg-[#20B2AA]/5 shadow-sm hover:shadow-md'
              } else if (item.label === 'Admin Login') {
                // Gold/Yellow gradient for Admin Login
                buttonClasses += isActive
                  ? ' bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-[0_4px_16px_rgba(255,215,0,0.4)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.5)] scale-100'
                  : ' bg-white text-[#D4AF37] border-2 border-[#FFD700]/20 hover:border-[#FFD700] hover:bg-[#FFD700]/5 shadow-sm hover:shadow-md'
              }

              return (
                <Button
                  key={item.href}
                  as={NavLink}
                  to={item.href}
                  variant="ghost"
                  size="md"
                  className={buttonClasses}
                >
                  {item.label}
                </Button>
              )
            })}
          </nav>
          <div className="relative" ref={menuRef}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              className={`min-w-[140px] justify-center rounded-2xl text-sm font-semibold transition-all duration-300 border-2 ${
                menuOpen
                  ? 'bg-white text-neutral-900 border-[#2563EB] shadow-sm'
                  : 'bg-white text-[#2563EB] border-[#2563EB]/20 hover:border-[#2563EB] hover:bg-[#2563EB]/5 shadow-sm hover:shadow-md'
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
                className="absolute right-0 mt-3 w-64 rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                {registerOptions.map((option) => (
                  <Button
                    key={option.href}
                    as={NavLink}
                    to={option.href}
                    variant="ghost"
                    size="md"
                    className="w-full justify-start rounded-xl border-0 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    {option.label}
                  </Button>
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
