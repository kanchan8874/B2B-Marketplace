import PropTypes from 'prop-types'
import logoImage from '../../assets/logo1.avif'

const Logo = ({ compact = false }) => {
  if (compact) {
    return (
      <img
        src={logoImage}
        alt="B2B Marketplace Logo"
        className="h-14 w-auto object-contain"
        loading="eager"
        decoding="async"
        width="auto"
        height="56"
      />
    )
  }

  return (
    <img
      src={logoImage}
      alt="B2B Marketplace Logo"
      className="h-12 w-auto object-contain"
      loading="eager"
      decoding="async"
      width="auto"
      height="48"
    />
  )
}

Logo.propTypes = {
  compact: PropTypes.bool,
}

export default Logo

