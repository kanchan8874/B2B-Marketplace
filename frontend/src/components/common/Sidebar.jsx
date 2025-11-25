import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ title, links }) => (
  <aside className="hidden w-64 rounded-3xl border border-surface-border bg-white/80 p-6 shadow-card lg:block">
    <h2 className="text-sm uppercase tracking-wide text-neutral-500">{title}</h2>
    <nav className="mt-4 space-y-1" aria-label={`${title} navigation`}>
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            [
              'flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition',
              isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-neutral-600 hover:bg-neutral-50',
            ].join(' ')
          }
        >
          {link.label}
          {link.badge && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">{link.badge}</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
)

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
}

export default Sidebar
