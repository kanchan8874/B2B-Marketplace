import PropTypes from 'prop-types'
import { useState } from 'react'
import { Users, Store, Search } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'

// Mock data
const buyers = [
  { id: 'b1', name: 'Fresh Basket Retail', contact: 'riya@freshbasket.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active', registered: '15 Jan 2025' },
  { id: 'b2', name: 'Pulse Hospitals', contact: 'ops@pulsehospitals.in', city: 'Hyderabad', state: 'Telangana', status: 'Active', registered: '12 Jan 2025' },
  { id: 'b3', name: 'PackMart Solutions', contact: 'contact@packmart.in', city: 'Delhi', state: 'Delhi', status: 'Active', registered: '10 Jan 2025' },
  { id: 'b4', name: 'Green Grocers Ltd', contact: 'info@greengrocers.in', city: 'Bangalore', state: 'Karnataka', status: 'Active', registered: '8 Jan 2025' },
]

const sellers = [
  { id: 's1', name: 'Nova Foods', contact: 'karan@novafoods.com', city: 'Pune', state: 'Maharashtra', status: 'Pending', registered: '20 Jan 2025', gst: '27AABCU9603R1ZX' },
  { id: 's2', name: 'Guardian Health', contact: 'contact@guardianhealth.in', city: 'Pune', state: 'Maharashtra', status: 'Active', registered: '18 Jan 2025', gst: '27AABCG1234R1ZX' },
  { id: 's3', name: 'Saffron Harvest Co.', contact: 'info@saffronharvest.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active', registered: '16 Jan 2025', gst: '27AABCS5678R1ZX' },
  { id: 's4', name: 'PackAge Labs', contact: 'sales@packagelabs.in', city: 'Ahmedabad', state: 'Gujarat', status: 'Pending', registered: '22 Jan 2025', gst: '24AABCP9012R1ZX' },
  { id: 's5', name: 'MediCare Supplies', contact: 'info@medicare.in', city: 'Chennai', state: 'Tamil Nadu', status: 'Active', registered: '14 Jan 2025', gst: '33AABCM3456R1ZX' },
]

const buyersColumns = [
  { header: 'Buyer Name', accessor: 'name' },
  { header: 'Contact Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  { header: 'Registered', accessor: 'registered' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone="success">{row.status}</StatusTag>,
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
        Block
      </Button>
    ),
  },
]

const sellersColumns = [
  { header: 'Seller Name', accessor: 'name' },
  { header: 'Contact Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  { header: 'GST Number', accessor: 'gst' },
  { header: 'Registered', accessor: 'registered' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</StatusTag>,
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex items-center gap-2">
        {row.status === 'Pending' && (
          <>
            <Button size="sm" variant="primary" className="h-7 px-3 text-xs">
              Approve
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
              Reject
            </Button>
          </>
        )}
        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10">
          {row.status === 'Active' ? 'Block' : 'Unblock'}
        </Button>
      </div>
    ),
  },
]

const UserManagement = ({ scope }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const isSellers = scope === 'sellers'
  const data = isSellers ? sellers : buyers
  const columns = isSellers ? sellersColumns : buyersColumns

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.contact.toLowerCase().includes(query) || item.city.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      <Card
        title={isSellers ? 'Sellers Management' : 'Buyers Management'}
        subtitle={isSellers ? `${sellers.length} sellers • ${sellers.filter((s) => s.status === 'Pending').length} pending approvals` : `${buyers.length} active buyers`}
      >
        <div className="mb-6">
          <FormField
            id="userSearch"
            name="userSearch"
            label="Search buyers"
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <DataTable columns={columns} data={filteredData} />
        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
            <p className="text-sm text-neutral-500">No {isSellers ? 'sellers' : 'buyers'} found matching your search.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

UserManagement.propTypes = {
  scope: PropTypes.string,
}

export default UserManagement
