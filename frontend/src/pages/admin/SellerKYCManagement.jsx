import { useState, useEffect } from 'react'
import { Search, FileText, CheckCircle, XCircle, Eye, Clock } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Modal from '../../components/common/Modal.jsx'
import { getPendingSellerKYCs, approveSellerKYC, rejectSellerKYC } from '../../services/kycService.js'

const ITEMS_PER_PAGE = 10

const SellerKYCManagement = () => {
  const [kycs, setKycs] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKYC, setSelectedKYC] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState(null) // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadKYCs()
  }, [statusFilter, page])

  const loadKYCs = async () => {
    try {
      setLoading(true)
      const response = await getPendingSellerKYCs(statusFilter, page, ITEMS_PER_PAGE)
      if (response.data) {
        setKycs(response.data.kycs || [])
        setTotal(response.data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Failed to load KYCs:', error)
      alert(error.message || 'Failed to load KYC submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (kyc) => {
    setSelectedKYC(kyc)
    setActionType('approve')
    setShowModal(true)
  }

  const handleReject = (kyc) => {
    setSelectedKYC(kyc)
    setActionType('reject')
    setRejectionReason('')
    setShowModal(true)
  }

  const handleViewDetails = (kyc) => {
    setSelectedKYC(kyc)
    setActionType('view')
    setShowModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedKYC) return

    if (actionType === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setProcessing(true)
    try {
      if (actionType === 'approve') {
        await approveSellerKYC(selectedKYC._id)
        alert('KYC approved successfully')
      } else if (actionType === 'reject') {
        await rejectSellerKYC(selectedKYC._id, rejectionReason)
        alert('KYC rejected')
      }
      setShowModal(false)
      setSelectedKYC(null)
      setRejectionReason('')
      loadKYCs()
    } catch (error) {
      alert(error.message || 'Failed to process action')
    } finally {
      setProcessing(false)
    }
  }

  const filteredKycs = searchQuery
    ? kycs.filter(
        (kyc) =>
          kyc.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kyc.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kyc.seller?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : kycs

  const columns = [
    {
      header: 'Business',
      accessor: 'businessName',
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.businessName}</p>
          <p className="text-xs text-neutral-500">{row.seller?.email}</p>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'contactPerson',
      cell: (row) => (
        <div>
          <p className="text-sm text-neutral-900">{row.contactPerson}</p>
          <p className="text-xs text-neutral-500">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'location',
      cell: (row) => (
        <div>
          <p className="text-sm text-neutral-900">{row.city}, {row.state}</p>
        </div>
      ),
    },
    {
      header: 'Business Type',
      accessor: 'businessType',
      cell: (row) => (
        <span className="text-sm text-neutral-700 capitalize">{row.businessType}</span>
      ),
    },
    {
      header: 'Years',
      accessor: 'yearsInBusiness',
      cell: (row) => <span className="text-sm text-neutral-700">{row.yearsInBusiness} years</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <StatusTag
          tone={
            row.status === 'Approved'
              ? 'success'
              : row.status === 'Rejected'
                ? 'danger'
                : 'warning'
          }
        >
          {row.status}
        </StatusTag>
      ),
    },
    {
      header: 'Submitted',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-xs text-neutral-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs rounded-full"
            onClick={() => handleViewDetails(row)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button
                size="sm"
                variant="primary"
                className="h-7 px-3 text-xs rounded-full"
                onClick={() => handleApprove(row)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-3 text-xs text-status-danger hover:bg-status-danger/10 rounded-full"
                onClick={() => handleReject(row)}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.70rem] font-semibold uppercase tracking-[0.24em] text-brand-secondary mb-1">
              Supply-side trust
            </p>
            <h1 className="text-2xl font-bold text-neutral-900 leading-snug">Seller KYC Management</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Verify seller businesses, review documents, and control which suppliers receive a verified badge.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200">
              <Clock className="h-3.5 w-3.5 text-status-warning" aria-hidden="true" />
              Pending reviews
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200">
              <CheckCircle className="h-3.5 w-3.5 text-status-success" aria-hidden="true" />
              Approved & verified sellers
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-emerald-50/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <FormField
              id="search"
              name="search"
              label="Search sellers"
              placeholder="Search by business name, seller email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Use search + status filters to quickly locate a specific seller application.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter seller KYC by status">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
              const isActive = statusFilter === status
              const baseClasses =
                'px-4 py-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary transition-colors'
              const activeClasses =
                'bg-brand-primary text-white shadow-[0_8px_20px_rgba(15,98,254,0.28)]'
              const inactiveClasses =
                'bg-white text-neutral-700 border border-neutral-200 hover:border-brand-primary/60 hover:text-brand-primary'

              return (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-pressed={isActive}
                  onClick={() => {
                    setStatusFilter(status)
                    setPage(1)
                  }}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                  {status}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* KYC Table */}
      <Card className="border-blue-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-sm text-neutral-600">Loading KYCs...</p>
            </div>
          </div>
        ) : filteredKycs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-emerald-50 to-blue-50 border border-blue-100">
              <FileText className="h-8 w-8 text-brand-primary" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-neutral-900">No seller KYC submissions yet</p>
            <p className="mt-1 max-w-md text-xs text-neutral-600">
              As new suppliers apply for verification, their applications will appear here for your review and approval.
            </p>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={filteredKycs} />
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal for View/Approve/Reject */}
      {showModal && selectedKYC && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedKYC(null)
            setRejectionReason('')
          }}
          title={
            actionType === 'view'
              ? 'KYC Details'
              : actionType === 'approve'
                ? 'Approve KYC'
                : 'Reject KYC'
          }
        >
          <div className="space-y-6">
            {actionType === 'view' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Business Name</p>
                    <p className="text-sm font-semibold text-neutral-900">{selectedKYC.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Contact Person</p>
                    <p className="text-sm text-neutral-900">{selectedKYC.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Email</p>
                    <p className="text-sm text-neutral-900">{selectedKYC.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Phone</p>
                    <p className="text-sm text-neutral-900">{selectedKYC.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Location</p>
                    <p className="text-sm text-neutral-900">
                      {selectedKYC.city}, {selectedKYC.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Business Type</p>
                    <p className="text-sm text-neutral-900 capitalize">{selectedKYC.businessType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Years in Business</p>
                    <p className="text-sm text-neutral-900">{selectedKYC.yearsInBusiness} years</p>
                  </div>
                  {selectedKYC.gstNumber && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">GST Number</p>
                      <p className="text-sm text-neutral-900">{selectedKYC.gstNumber}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Business Address</p>
                  <p className="text-sm text-neutral-900">{selectedKYC.businessAddress}</p>
                </div>
                {selectedKYC.documents && (
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Documents</p>
                    <div className="space-y-2">
                      {selectedKYC.documents.certificateOfIncorporation && (
                        <a
                          href={`http://localhost:5000/${selectedKYC.documents.certificateOfIncorporation}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          Certificate of Incorporation
                        </a>
                      )}
                      {selectedKYC.documents.gstCertificate && (
                        <a
                          href={`http://localhost:5000/${selectedKYC.documents.gstCertificate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          GST Certificate
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {actionType === 'approve' && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700">
                  Are you sure you want to approve this KYC submission? The seller will receive a verified badge.
                </p>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-900 mb-1">Business: {selectedKYC.businessName}</p>
                  <p className="text-xs text-emerald-700">This action cannot be undone.</p>
                </div>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-700">
                  Please provide a reason for rejecting this KYC submission. The seller will be notified.
                </p>
                <FormField
                  id="rejectionReason"
                  name="rejectionReason"
                  label="Rejection Reason"
                  required
                  as="textarea"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Documents are unclear, missing information, etc."
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false)
                  setSelectedKYC(null)
                  setRejectionReason('')
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              {(actionType === 'approve' || actionType === 'reject') && (
                <Button
                  variant={actionType === 'approve' ? 'primary' : 'danger'}
                  onClick={handleConfirmAction}
                  disabled={processing}
                >
                  {processing
                    ? 'Processing...'
                    : actionType === 'approve'
                      ? 'Approve KYC'
                      : 'Reject KYC'}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SellerKYCManagement

