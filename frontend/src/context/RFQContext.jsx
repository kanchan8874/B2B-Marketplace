import { createContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { rfqs as mockRfqs } from '../mocks/rfqs.js'

export const RFQContext = createContext({ rfqs: [] })

export const RFQProvider = ({ children }) => {
  const [rfqs, setRfqs] = useState(mockRfqs)
  const value = useMemo(() => ({ rfqs, setRfqs }), [rfqs])

  return <RFQContext.Provider value={value}>{children}</RFQContext.Provider>
}

RFQProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
