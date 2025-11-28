import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users Management', href: '/admin/users' },
  { label: 'Products Management', href: '/admin/products' },
  { label: 'RFQ Monitor', href: '/admin/rfqs' },
]

const AdminDashboardNav = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate('/admin/profile')
  }

  return (
    <header className="rounded-[28px] border border-surface-border bg-gradient-to-r from-white via-blue-50/60 to-emerald-50/70 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.10)] sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Logo compact />
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-secondary">Admin console</p>
            <p className="text-sm text-neutral-600">Control users, products, and RFQs in one place.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin dashboard">
            {adminLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40',
                    isActive
                      ? 'bg-brand-secondary/10 text-brand-secondary shadow-sm'
                      : 'text-neutral-600 hover:text-brand-secondary hover:bg-white/70',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:border-brand-secondary hover:text-brand-secondary hover:bg-white"
            onClick={handleProfileClick}
          >
            Profile
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminDashboardNav

