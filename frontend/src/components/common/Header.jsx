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
        <NavLink to="/" aria-label="B2B marketplace home">
          <Logo />
        </NavLink>
        <div className="flex items-center gap-2">
          <nav aria-label="Primary authentication links" className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                as={NavLink}
                to={item.href}
                variant={pathname === item.href ? 'primary' : 'ghost'}
                size="md"
                className="min-w-[140px] justify-center rounded-full border border-surface-border text-sm font-semibold"
              >
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="relative" ref={menuRef}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="min-w-[140px] justify-center rounded-full border border-brand-secondary text-sm font-semibold text-brand-secondary"
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
                className="absolute right-0 mt-3 w-60 rounded-3xl border border-surface-border bg-white p-3 shadow-card"
              >
                {registerOptions.map((option) => (
                  <Button
                    key={option.href}
                    as={NavLink}
                    to={option.href}
                    variant="ghost"
                    size="md"
                    className="w-full justify-start rounded-2xl border border-transparent text-sm font-semibold text-neutral-700 hover:border-surface-border"
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
