import PropTypes from 'prop-types'
import DataTable from '../common/DataTable.jsx'

const RFQMonitorList = ({ items }) => {
  const columns = [
    { header: 'RFQ ID', accessor: 'id' },
    { header: 'Product', accessor: 'productName' },
    { header: 'Buyer', accessor: 'buyer' },
    { header: 'Seller', accessor: 'seller' },
    { header: 'Status', accessor: 'status' },
    { header: 'Last Activity', accessor: 'updatedOn' },
  ]

  return <DataTable columns={columns} data={items} />
}

RFQMonitorList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RFQMonitorList
