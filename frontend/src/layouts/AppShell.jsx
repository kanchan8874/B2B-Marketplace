import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Header from '../components/common/Header.jsx'
import Footer from '../components/common/Footer.jsx'

const footerAllowedPaths = ['/', '/auth/buyer/login', '/auth/seller/login', '/auth/admin/login']

const AppShell = ({ children }) => {
  const { pathname } = useLocation()
  const showFooter = footerAllowedPaths.includes(pathname)
  const isHomePage = pathname === '/'

  return (
    <div
      className={`relative flex flex-col bg-neutral-50 text-neutral-800 ${
        isHomePage ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <a
        href="#main"
        className="absolute left-4 top-4 z-50 -translate-y-20 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main"
        className={`flex-1 ${
          isHomePage ? 'w-full overflow-hidden' : 'w-full px-5 pb-5 pt-0 sm:px-6 lg:px-8 '
        }`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

AppShell.propTypes = {
  children: PropTypes.node,
}

export default AppShell

