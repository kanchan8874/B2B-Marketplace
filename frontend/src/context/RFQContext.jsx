import { createContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const RFQContext = createContext({ rfqs: [] })

export const RFQProvider = ({ children }) => {
  // Start with empty RFQ list; pages will fetch real data from the API
  const [rfqs, setRfqs] = useState([])
  const value = useMemo(() => ({ rfqs, setRfqs }), [rfqs])

  return <RFQContext.Provider value={value}>{children}</RFQContext.Provider>
}

RFQProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
