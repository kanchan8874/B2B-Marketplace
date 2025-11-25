import PropTypes from 'prop-types'
import AdminDashboardNav from '../components/nav/AdminDashboardNav.jsx'

const AdminLayout = ({ children }) => (
  <div className="space-y-8">
    <AdminDashboardNav />
    <section className="rounded-3xl border border-surface-border bg-white/90 p-6 shadow-card">
      <p className="text-sm uppercase tracking-wide text-brand-secondary">Admin console</p>
      <h2 className="text-2xl font-semibold text-neutral-900">Control users, products, and RFQs</h2>
    </section>
    {children}
  </div>
)

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AdminLayout
