import PropTypes from 'prop-types'
import SellerDashboardNav from '../components/nav/SellerDashboardNav.jsx'

const SellerLayout = ({ children }) => (
  <div className="space-y-8">
    <SellerDashboardNav />
    <section className="rounded-3xl border border-surface-border bg-white/90 p-6 shadow-card">
      <p className="text-sm uppercase tracking-wide text-brand-secondary">Seller workspace</p>
      <h2 className="text-2xl font-semibold text-neutral-900">Manage catalogues & respond faster</h2>
    </section>
    {children}
  </div>
)

SellerLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SellerLayout
