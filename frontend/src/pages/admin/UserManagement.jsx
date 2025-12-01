import PropTypes from 'prop-types'
import { useState } from 'react'
import { Users, Store, Search } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'

// Mock data
const buyersSeed = [
  { id: 'b1', name: 'Fresh Basket Retail', contact: 'riya@freshbasket.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active', registered: '15 Jan 2025' },
  { id: 'b2', name: 'Pulse Hospitals', contact: 'ops@pulsehospitals.in', city: 'Hyderabad', state: 'Telangana', status: 'Active', registered: '12 Jan 2025' },
  { id: 'b3', name: 'PackMart Solutions', contact: 'contact@packmart.in', city: 'Delhi', state: 'Delhi', status: 'Active', registered: '10 Jan 2025' },
  { id: 'b4', name: 'Green Grocers Ltd', contact: 'info@greengrocers.in', city: 'Bangalore', state: 'Karnataka', status: 'Active', registered: '8 Jan 2025' },
]

const sellersSeed = [
  { id: 's1', name: 'Nova Foods', contact: 'karan@novafoods.com', city: 'Pune', state: 'Maharashtra', status: 'Pending', registered: '20 Jan 2025', gst: '27AABCU9603R1ZX' },
  { id: 's2', name: 'Guardian Health', contact: 'contact@guardianhealth.in', city: 'Pune', state: 'Maharashtra', status: 'Active', registered: '18 Jan 2025', gst: '27AABCG1234R1ZX' },
  { id: 's3', name: 'Saffron Harvest Co.', contact: 'info@saffronharvest.com', city: 'Mumbai', state: 'Maharashtra', status: 'Active', registered: '16 Jan 2025', gst: '27AABCS5678R1ZX' },
  { id: 's4', name: 'PackAge Labs', contact: 'sales@packagelabs.in', city: 'Ahmedabad', state: 'Gujarat', status: 'Pending', registered: '22 Jan 2025', gst: '24AABCP9012R1ZX' },
  { id: 's5', name: 'MediCare Supplies', contact: 'info@medicare.in', city: 'Chennai', state: 'Tamil Nadu', status: 'Active', registered: '14 Jan 2025', gst: '33AABCM3456R1ZX' },
]

const createBuyerColumns = (onActionClick) => [
  { header: 'Buyer Name', accessor: 'name' },
  { header: 'Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => <StatusTag tone={row.status === 'Blocked' ? 'danger' : 'success'}>{row.status}</StatusTag>,
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10"
          onClick={() =>
            onActionClick({
              type: 'buyer',
              action: row.status === 'Active' ? 'block' : 'unblock',
              record: row,
            })
          }
        >
          {row.status === 'Active' ? 'Block' : 'Unblock'}
        </Button>
      </div>
    ),
  },
]

const createSellerColumns = (onActionClick) => [
  { header: 'Seller Name', accessor: 'name' },
  { header: 'Email', accessor: 'contact' },
  { header: 'Location', accessor: (row) => `${row.city}, ${row.state}` },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <StatusTag
        tone={
          row.status === 'Active'
            ? 'success'
            : row.status === 'Pending'
            ? 'warning'
            : row.status === 'Rejected'
            ? 'danger'
            : 'neutral'
        }
      >
        {row.status}
      </StatusTag>
    ),
  },
  {
    header: 'Actions',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex items-center gap-2">
        {row.status === 'Pending' && (
          <>
            <Button
              size="sm"
              variant="primary"
              className="h-7 px-3 text-xs"
              onClick={() =>
                onActionClick({
                  type: 'seller',
                  action: 'approve',
                  record: row,
                })
              }
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10"
              onClick={() =>
                onActionClick({
                  type: 'seller',
                  action: 'reject',
                  record: row,
                })
              }
            >
              Reject
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10"
          onClick={() =>
            onActionClick({
              type: 'seller',
              action: row.status === 'Active' ? 'block' : 'unblock',
              record: row,
            })
          }
        >
          {row.status === 'Active' ? 'Block' : 'Unblock'}
        </Button>
      </div>
    ),
  },
]

const UserManagement = ({ scope }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(scope === 'sellers' ? 'seller' : 'buyer')
  const [buyers, setBuyers] = useState(buyersSeed)
  const [sellers, setSellers] = useState(sellersSeed)
  const [pendingAction, setPendingAction] = useState(null)
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 5

  const isSellers = activeTab === 'seller'
  const data = isSellers ? sellers : buyers
  const columns = isSellers
    ? createSellerColumns(setPendingAction)
    : createBuyerColumns(setPendingAction)

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.contact.toLowerCase().includes(query) || item.city.toLowerCase().includes(query)
  })

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE)

  const handleConfirmAction = () => {
    if (!pendingAction) return

    const { type, action, record } = pendingAction

    if (type === 'buyer') {
      setBuyers((prev) =>
        prev.map((buyer) =>
          buyer.id === record.id
            ? {
                ...buyer,
                status: action === 'block' ? 'Blocked' : 'Active',
              }
            : buyer,
        ),
      )
    } else if (type === 'seller') {
      setSellers((prev) =>
        prev.map((seller) => {
          if (seller.id !== record.id) return seller
          if (action === 'approve') {
            return { ...seller, status: 'Active' }
          }
          if (action === 'reject') {
            return { ...seller, status: 'Rejected' }
          }
          if (action === 'block') {
            return { ...seller, status: 'Blocked' }
          }
          if (action === 'unblock') {
            return { ...seller, status: 'Active' }
          }
          return seller
        }),
      )
    }

    setPendingAction(null)
  }

  const handleCancelAction = () => {
    setPendingAction(null)
  }

  const actionLabelMap = {
    block: 'Block',
    unblock: 'Unblock',
    approve: 'Approve',
    reject: 'Reject',
  }

  const actionDescriptionMap = {
    block: 'They will no longer be able to sign in or create new RFQs until unblocked.',
    unblock: 'The account will be able to sign in and use the marketplace again.',
    approve: 'This seller will be activated and able to receive RFQs from buyers.',
    reject: 'The seller will be marked as rejected and cannot list products or receive RFQs.',
  }

  return (
    <div className="space-y-0">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-t-2xl border border-blue-100 bg-white/90 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            className={`min-w-[120px] rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              !isSellers
                ? 'bg-gradient-to-r from-blue-300 to-sky-300 text-black'
                : 'text-neutral-600 hover:bg-blue-50'
            }`}
          >
            Buyers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seller')}
            className={`min-w-[120px] rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              isSellers
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black'
                : 'text-neutral-600 hover:bg-emerald-50'
            }`}
          >
            Sellers
          </button>
        </div>
        <div className="hidden text-xs text-neutral-500 sm:block">
          {isSellers
            ? `${sellers.length} sellers • ${sellers.filter((s) => s.status === 'Pending').length} pending approvals`
            : `${buyers.length} active buyers`}
        </div>
      </div>

      <Card
        title={isSellers ? 'Seller accounts' : 'Buyer accounts'}
        subtitle={
          isSellers
            ? 'Review, approve, or block seller organisations.'
            : 'Monitor verified buying organisations on the marketplace.'
        }
        className="rounded-tl-none"
      >
        <div className="mb-6">
          <FormField
            id="userSearch"
            name="userSearch"
            label={`Search ${isSellers ? 'sellers' : 'buyers'}`}
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <DataTable columns={columns} data={paginatedData} />
        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
            <p className="text-sm text-neutral-500">No {isSellers ? 'sellers' : 'buyers'} found matching your search.</p>
          </div>
        )}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>

      {/* Confirmation dialog for buyer/seller actions */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-action-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)]"
          >
            <h2
              id="admin-user-action-title"
              className="text-lg font-semibold text-neutral-900"
            >
              {actionLabelMap[pendingAction.action]}{' '}
              {pendingAction.type === 'buyer' ? 'buyer account?' : 'seller account?'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              You&apos;re about to{' '}
              <span className="font-semibold text-neutral-900">
                {actionLabelMap[pendingAction.action]?.toLowerCase()}
              </span>{' '}
              the{' '}
              <span className="font-semibold text-neutral-900">
                {pendingAction.record.name}
              </span>{' '}
              account. {actionDescriptionMap[pendingAction.action]}
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs text-neutral-700">
              <p className="flex justify-between gap-4">
                <span className="text-neutral-500">
                  {pendingAction.type === 'buyer' ? 'Buyer email' : 'Seller email'}
                </span>
                <span className="font-semibold text-neutral-900">
                  {pendingAction.record.contact}
                </span>
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="text-neutral-500">Location</span>
                <span className="font-semibold text-neutral-900">
                  {pendingAction.record.city}, {pendingAction.record.state}
                </span>
              </p>
              {pendingAction.type === 'seller' && pendingAction.record.gst && (
                <p className="mt-1 flex justify-between gap-4">
                  <span className="text-neutral-500">GSTIN</span>
                  <span className="font-mono text-[11px] font-semibold text-neutral-900">
                    {pendingAction.record.gst}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm"
                onClick={handleCancelAction}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="md"
                className="rounded-2xl px-4 py-2.5 text-sm bg-status-danger hover:bg-status-danger/90 shadow-[0_8px_24px_rgba(192,28,40,0.35)]"
                onClick={handleConfirmAction}
              >
                {actionLabelMap[pendingAction.action]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

UserManagement.propTypes = {
  scope: PropTypes.string,
}

export default UserManagement
