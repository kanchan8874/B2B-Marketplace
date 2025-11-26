import PropTypes from 'prop-types'
import logoImage from '../../assets/logo1.avif'

const Logo = ({ compact = false }) => {
  if (compact) {
    return (
      <img
        src={logoImage}
        alt="B2B Marketplace Logo"
        className="h-14 w-auto object-contain"
      />
    )
  }

  return (
    <img
      src={logoImage}
      alt="B2B Marketplace Logo"
      className="h-12 w-auto object-contain"
    />
  )
}

Logo.propTypes = {
  compact: PropTypes.bool,
}

export default Logo

