import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const sellerLinks = [
  { label: 'My Products', href: '/seller/products' },
  { label: 'Add Product', href: '/seller/products/new' },
  { label: 'RFQs Received', href: '/seller/rfqs' },
]

const SellerDashboardNav = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser?.(null)
    navigate('/')
  }

  return (
    <header className="rounded-[28px] border border-surface-border bg-gradient-to-r from-white to-brand-primary/5 px-4 py-3 shadow-[0_10px_30px_rgba(15,98,254,0.08)] sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Logo compact />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary">Seller cockpit</p>
            <p className="text-sm text-neutral-600">Maintain catalogues and reply to RFQs.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Seller dashboard">
            {sellerLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  [
                    'rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40',
                    isActive ? 'border-brand-primary bg-white text-brand-primary' : 'border-transparent text-neutral-600 hover:text-brand-primary',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="rounded-full px-5 text-sm font-semibold"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default SellerDashboardNav

