import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const adminLinks = [
  { label: 'Users Management', href: '/admin/users' },
  { label: 'Products Management', href: '/admin/products' },
  { label: 'RFQ Monitor', href: '/admin/rfqs' },
]

const AdminDashboardNav = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser?.(null)
    navigate('/')
  }

  return (
    <header className="rounded-[28px] border border-surface-border bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,98,254,0.06)] sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Logo compact />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-secondary">Admin console</p>
            <p className="text-sm text-neutral-600">Monitor compliance, catalogue, and RFQs.</p>
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
                    isActive ? 'bg-brand-secondary/10 text-brand-secondary' : 'text-neutral-600 hover:text-brand-secondary',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:border-brand-secondary hover:text-brand-secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminDashboardNav

