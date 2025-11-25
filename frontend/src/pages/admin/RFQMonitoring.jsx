import { useState } from 'react'
import { FileText, Search, Eye, X } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { rfqs } from '../../mocks/rfqs.js'

// Enrich RFQs with seller info and response details
const enrichedRFQs = rfqs.map((rfq, index) => ({
  ...rfq,
  id: `rfq-${index + 1}`,
  seller: index === 0 ? 'Saffron Harvest Co.' : 'Guardian Health',
  status: index === 0 ? 'Awaiting Response' : 'Responded',
  created: '24 Nov 2025',
  responsePrice: index === 1 ? '₹22 per unit' : null,
  responseTerms: index === 1 ? 'Delivery within 7 days. Payment: 50% advance, 50% on delivery.' : null,
  responseDate: index === 1 ? '23 Nov 2025, 14:30' : null,
}))

const createColumns = (onViewClick) => [
  { header: 'RFQ ID', accessor: 'id' },
  { header: 'Product', accessor: 'productName' },
  { header: 'Buyer', accessor: 'buyer' },
  { header: 'Seller', accessor: 'seller' },
  { header: 'Quantity', accessor: (row) => row.quantity.toLocaleString() },
  { header: 'Location', accessor: 'location' },
  { header: 'Created', accessor: 'created' },
  {
    header: 'Status',
    accessor: 'status',
    cell: (row) => (
      <StatusTag tone={row.status === 'Responded' ? 'success' : 'warning'}>{row.status}</StatusTag>
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
            <p className="mt-1 text-sm font-semibold text-neutral-900">{rfq.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</p>
            <div className="mt-1">
              <StatusTag tone={rfq.status === 'Responded' ? 'success' : 'warning'}>{rfq.status}</StatusTag>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Product Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-neutral-500">Product:</span> <span className="font-medium text-neutral-900">{rfq.productName}</span>
            </div>
            <div>
              <span className="text-neutral-500">Quantity Requested:</span>{' '}
              <span className="font-medium text-neutral-900">{rfq.quantity.toLocaleString()} units</span>
            </div>
            <div>
              <span className="text-neutral-500">Delivery Location:</span>{' '}
              <span className="font-medium text-neutral-900">{rfq.location}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Parties</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Buyer</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">{rfq.buyer}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Seller</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">{rfq.seller}</p>
            </div>
          </div>
        </div>

        {rfq.status === 'Responded' && rfq.responsePrice && (
          <div className="rounded-lg border border-status-success/20 bg-status-success/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-status-success">Seller Response</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-neutral-600">Final Price:</span>{' '}
                <span className="font-semibold text-neutral-900">{rfq.responsePrice}</span>
              </div>
              <div>
                <span className="text-neutral-600">Terms:</span>{' '}
                <span className="text-neutral-900">{rfq.responseTerms}</span>
              </div>
              <div>
                <span className="text-neutral-600">Response Date:</span>{' '}
                <span className="text-neutral-900">{rfq.responseDate}</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-surface-border pt-4">
          <p className="text-xs text-neutral-500">Created: {rfq.created}</p>
        </div>
      </div>
      </div>
    </div>
  )
}

const RFQMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRFQ, setSelectedRFQ] = useState(null)

  const filteredRFQs = enrichedRFQs.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.id.toLowerCase().includes(query) ||
      item.productName.toLowerCase().includes(query) ||
      item.buyer.toLowerCase().includes(query) ||
      item.seller.toLowerCase().includes(query)
    )
  })

  const columns = createColumns((rfq) => setSelectedRFQ(rfq))

  return (
    <div className="space-y-6">
      <Card
        title="RFQ Monitoring"
        subtitle={`${enrichedRFQs.length} total RFQs • ${enrichedRFQs.filter((r) => r.status === 'Awaiting Response').length} awaiting response`}
      >
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
        <DataTable columns={columns} data={filteredRFQs} />
        {filteredRFQs.length === 0 && (
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
