import PropTypes from 'prop-types'
import BuyerDashboardNav from '../components/nav/BuyerDashboardNav.jsx'

const BuyerLayout = ({ children }) => (
  <div className="space-y-8">
    <BuyerDashboardNav />
    {children}
  </div>
)

BuyerLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default BuyerLayout
