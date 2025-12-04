import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Users, Store, Search } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { listAdminUsers, updateUserStatus, updateUserApproval } from '../../services/adminService.js'

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
  const [buyers, setBuyers] = useState([])
  const [sellers, setSellers] = useState([])
  const [pendingAction, setPendingAction] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const PAGE_SIZE = 5

  const isSellers = activeTab === 'seller'
  const data = isSellers ? sellers : buyers
  const columns = isSellers
    ? createSellerColumns(setPendingAction)
    : createBuyerColumns(setPendingAction)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [buyersData, sellersData] = await Promise.all([
          listAdminUsers({ role: 'buyer' }),
          listAdminUsers({ role: 'seller' }),
        ])

        if (!isMounted) return

        const mapStatus = (user) => {
          if (user.role === 'buyer') {
            return user.isActive ? 'Active' : 'Blocked'
          }

          // Seller
          if (user.isApproved === true) {
            return user.isActive ? 'Active' : 'Blocked'
          }
          if (user.isApproved === false) {
            return 'Rejected'
          }
          return 'Pending'
        }

        setBuyers(
          (buyersData || []).map((u) => ({
            id: u._id,
            name: u.name || u.companyName || u.email,
            contact: u.email,
            city: u.location?.city || '',
            state: u.location?.state || '',
            status: mapStatus({ ...u, role: 'buyer' }),
            registered: new Date(u.createdAt || Date.now()).toLocaleDateString(),
            raw: u,
          })),
        )
        setSellers(
          (sellersData || []).map((u) => ({
            id: u._id,
            name: u.name || u.companyName || u.email,
            contact: u.email,
            city: u.location?.city || '',
            state: u.location?.state || '',
            status: mapStatus({ ...u, role: 'seller' }),
            registered: new Date(u.createdAt || Date.now()).toLocaleDateString(),
            gst: u.gstNumber || '',
            raw: u,
          })),
        )
      } catch (err) {
        console.error('Failed to load admin users:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load users.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.contact.toLowerCase().includes(query) || item.city.toLowerCase().includes(query)
  })

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE)

  const handleConfirmAction = async () => {
    if (!pendingAction) return

    const { type, action, record } = pendingAction

    try {
      if (action === 'approve' || action === 'reject') {
        const isApproved = action === 'approve'
        await updateUserApproval(record.id, isApproved)
        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === record.id
              ? {
                  ...seller,
                  status: isApproved ? 'Active' : 'Rejected',
                }
              : seller,
          ),
        )
      } else if (action === 'block' || action === 'unblock') {
        const isActive = action === 'unblock'
        await updateUserStatus(record.id, isActive)

        if (type === 'buyer') {
          setBuyers((prev) =>
            prev.map((buyer) =>
              buyer.id === record.id
                ? {
                    ...buyer,
                    status: isActive ? 'Active' : 'Blocked',
                  }
                : buyer,
            ),
          )
        } else if (type === 'seller') {
          setSellers((prev) =>
            prev.map((seller) =>
              seller.id === record.id
                ? {
                    ...seller,
                    status: isActive ? 'Active' : 'Blocked',
                  }
                : seller,
            ),
          )
        }
      }
    } catch (err) {
      console.error('Failed to update user status/approval:', err)
      setError(err.message || 'Failed to update user.')
    } finally {
      setPendingAction(null)
    }
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
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-10 text-center text-sm text-neutral-600">Loading users...</div>
        ) : (
          <DataTable columns={columns} data={paginatedData} />
        )}
        {!loading && filteredData.length === 0 && (
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
