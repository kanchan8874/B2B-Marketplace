import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

const footerLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Data & KYC', href: '/data-kyc' },
  { label: 'Terms', href: '/terms' },
]

const Footer = () => (
  <footer className="border-t border-surface-border bg-surface-base/80 backdrop-blur-md shadow-[0_-8px_32px_rgba(15,23,42,0.12),0_-4px_16px_rgba(37,99,235,0.08),0_-2px_8px_rgba(15,23,42,0.06)]">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <NavLink to="/" aria-label="B2B marketplace home" className="flex items-center gap-2">
        <Logo />
        <div className="flex flex-col leading-tight">
          <p className="text-xs font-light uppercase tracking-[0.35em] text-neutral-600">Premium</p>
          <p className="text-sm font-semibold text-neutral-900">Marketplace</p>
        </div>
      </NavLink>
      <p className="text-center sm:text-left">
        <span className="font-semibold text-neutral-800">© {new Date().getFullYear()} Atlas Trade.</span>{' '}
        <span className="text-neutral-500"> All Rights Reserved. B2B Marketplace.</span>
      </p>
      <nav className="flex items-center justify-center gap-4 sm:justify-end" aria-label="Legal links">
        {footerLinks.map((link) => (
          <NavLink
            key={link.label}
            className="font-semibold text-neutral-700 hover:text-brand-primary focus-visible:text-brand-primary"
            to={link.href}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  </footer>
)

export default Footer
