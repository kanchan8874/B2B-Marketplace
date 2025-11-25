import Logo from './Logo.jsx'

const footerLinks = [
  { label: 'Accessibility', href: '#accessibility' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
]

const Footer = () => (
  <footer className="border-t border-surface-border bg-surface-base/80 backdrop-blur-md">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Logo compact />
      </div>
      <p className="text-center sm:text-left">
        <span className="font-semibold text-neutral-800">© {new Date().getFullYear()} Atlas Trade</span>{' '}
        <span className="text-neutral-500">All rights reserved.</span>
      </p>
      <div className="flex items-center justify-center gap-4 sm:justify-end">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            className="font-semibold text-neutral-700 hover:text-brand-primary focus-visible:text-brand-primary"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
