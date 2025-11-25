import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import { rfqs } from '../../mocks/rfqs.js'

const columns = (navigate) => [
  { header: 'RFQ ID', accessor: 'id' },
  { header: 'Product', accessor: 'productName' },
  { header: 'Buyer', accessor: 'buyer' },
  { header: 'Quantity', accessor: (row) => row.quantity.toLocaleString() },
  { header: 'Delivery Location', accessor: 'location' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone={row.status === 'Responded' ? 'success' : 'warning'}>{row.status}</StatusTag>,
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs" onClick={() => navigate(`/seller/rfqs/${row.id}/respond`)}>
          View / Respond
        </Button>
      </div>
    ),
  },
]

const RFQInbox = () => {
  const navigate = useNavigate()

  return (
    <Card title="RFQ inbox" subtitle="Respond quickly to convert opportunities">
      <DataTable columns={columns(navigate)} data={rfqs} />
    </Card>
  )
}

export default RFQInbox
