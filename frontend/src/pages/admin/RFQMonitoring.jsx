import { useEffect, useMemo, useState } from 'react'
import { FileText, Search, Eye, X } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { listRFQsAdmin } from '../../services/adminService.js'

const createColumns = (onViewClick) => [
  { header: 'RFQ ID', accessor: '_id' },
  { header: 'Product', accessor: 'productName' },
  { header: 'Buyer', accessor: 'buyerName' },
  { header: 'Seller', accessor: 'sellerName' },
  { header: 'Quantity', accessor: 'quantityText' },
  { header: 'Location', accessor: 'locationText' },
  { header: 'Created', accessor: 'createdText' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <StatusTag
        tone={
          row.status === 'Quoted' || row.status === 'Accepted'
            ? 'success'
            : row.status === 'Declined'
              ? 'danger'
              : 'warning'
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
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-3 text-xs"
        onClick={() => onViewClick(row)}
      >
        <Eye className="mr-1 h-3 w-3" aria-hidden="true" />
        View
      </Button>
    ),
  },
]

const RFQDetailView = ({ rfq, onClose }) => {
  if (!rfq) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 px-4 py-8">
      <div role="dialog" aria-modal="true" className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">RFQ Details</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-transparent p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">RFQ ID</p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">{rfq._id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</p>
            <div className="mt-1">
              <StatusTag
                tone={
                  rfq.status === 'Quoted' || rfq.status === 'Accepted'
                    ? 'success'
                    : rfq.status === 'Declined'
                      ? 'danger'
                      : 'warning'
                }
              >
                {rfq.status}
              </StatusTag>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Product Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-neutral-500">Product:</span>{' '}
              <span className="font-medium text-neutral-900">
                {rfq.product?.name || 'Product'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Quantity Requested:</span>{' '}
              <span className="font-medium text-neutral-900">
                {rfq.quantity?.toLocaleString?.() ?? '-'} units
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Delivery Location:</span>{' '}
              <span className="font-medium text-neutral-900">
                {[rfq.deliveryLocation?.city, rfq.deliveryLocation?.state].filter(Boolean).join(', ') ||
                  'Location N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Parties</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Buyer</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {rfq.buyer?.name || rfq.buyer?.companyName || rfq.buyer?.email || 'Buyer'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Seller</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {rfq.seller?.name || rfq.seller?.companyName || rfq.seller?.email || 'Seller'}
              </p>
            </div>
          </div>
        </div>

        {rfq.response && (
          <div className="rounded-lg border border-status-success/20 bg-status-success/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-status-success">Seller Response</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-neutral-600">Final Price:</span>{' '}
                <span className="font-semibold text-neutral-900">
                  {rfq.response.finalPrice != null ? `₹${rfq.response.finalPrice.toLocaleString()}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-neutral-600">Terms:</span>{' '}
                <span className="text-neutral-900">{rfq.response.terms || '—'}</span>
              </div>
              <div>
                <span className="text-neutral-600">Response Date:</span>{' '}
                <span className="text-neutral-900">
                  {rfq.response.createdAt
                    ? new Date(rfq.response.createdAt).toLocaleString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-surface-border pt-4">
          <p className="text-xs text-neutral-500">
            Created:{' '}
            {rfq.createdAt ? new Date(rfq.createdAt).toLocaleString() : '—'}
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}

const RFQMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await listRFQsAdmin()

        if (!isMounted) return

        // Normalize to include latest response (if any)
        const normalized = (data || []).map((item) => {
          const latestResponse =
            Array.isArray(item.responses) && item.responses.length > 0
              ? item.responses[item.responses.length - 1]
              : item.response || null

          const productName = item.product?.name || '—'
          const buyerName =
            item.buyer?.name || item.buyer?.companyName || item.buyer?.email || '—'
          const sellerName =
            item.seller?.name || item.seller?.companyName || item.seller?.email || '—'
          const quantityText = item.quantity?.toLocaleString?.() ?? '—'
          const locationText =
            [item.deliveryLocation?.city, item.deliveryLocation?.state]
              .filter(Boolean)
              .join(', ') || '—'
          const createdText = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : '—'

          return {
            ...item,
            response: latestResponse,
            productName,
            buyerName,
            sellerName,
            quantityText,
            locationText,
            createdText,
          }
        })

        setRfqs(normalized)
      } catch (err) {
        console.error('[Admin RFQMonitoring] Failed to load RFQs', err)
        if (isMounted) {
          setError(err.message || 'Failed to load RFQs.')
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

  const filteredRFQs = useMemo(() => {
    const list = Array.isArray(rfqs) ? rfqs : []
    if (!searchQuery) return list
    const query = searchQuery.toLowerCase()
    return list.filter((item) => {
      const productName = item.productName || ''
      const buyerName = item.buyerName || ''
      const sellerName = item.sellerName || ''

      return (
        item._id?.toLowerCase?.().includes(query) ||
        productName.toLowerCase().includes(query) ||
        buyerName.toLowerCase().includes(query) ||
        sellerName.toLowerCase().includes(query)
      )
    })
  }, [rfqs, searchQuery])

  const awaitingResponseCount = useMemo(
    () => (Array.isArray(rfqs) ? rfqs.filter((r) => r.status === 'Pending Response').length : 0),
    [rfqs],
  )

  const columns = createColumns((rfq) => setSelectedRFQ(rfq))

  return (
    <div className="space-y-6">
      <Card
        title="RFQ Monitoring"
        subtitle={`${rfqs.length} total RFQs • ${awaitingResponseCount} awaiting response`}
      >
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="mb-6">
          <FormField
            id="rfqSearch"
            name="rfqSearch"
            label="Search RFQs"
            type="text"
            placeholder="Search by RFQ ID, product, buyer, or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <DataTable columns={columns} data={filteredRFQs} loading={loading} />
        {!loading && filteredRFQs.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-neutral-300" aria-hidden="true" />
            <p className="text-sm text-neutral-500">No RFQs found matching your search.</p>
          </div>
        )}
      </Card>

      <RFQDetailView rfq={selectedRFQ} onClose={() => setSelectedRFQ(null)} />
    </div>
  )
}

export default RFQMonitoring
