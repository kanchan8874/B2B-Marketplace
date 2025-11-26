import PropTypes from 'prop-types'
import SellerDashboardNav from '../components/nav/SellerDashboardNav.jsx'

const SellerLayout = ({ children }) => (
  <div className="space-y-8">
    <SellerDashboardNav />
    {children}
  </div>
)

SellerLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SellerLayout
