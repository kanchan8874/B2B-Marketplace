import PropTypes from 'prop-types'
import AdminDashboardNav from '../components/nav/AdminDashboardNav.jsx'

const AdminLayout = ({ children }) => (
  <div className="space-y-8">
    <AdminDashboardNav />
    {children}
  </div>
)

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AdminLayout
