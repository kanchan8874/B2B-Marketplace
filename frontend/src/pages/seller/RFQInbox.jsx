import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { rfqs } from '../../mocks/rfqs.js'

const ITEMS_PER_PAGE = 5

const RFQInbox = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const filteredRFQs = useMemo(() => {
    if (!searchQuery) return rfqs
    const query = searchQuery.toLowerCase()
    return rfqs.filter(
      (rfq) =>
        rfq.productName.toLowerCase().includes(query) ||
        rfq.buyer?.toLowerCase().includes(query) ||
        rfq.location?.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const totalPages = Math.ceil(filteredRFQs.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedRFQs = filteredRFQs.slice(startIndex, endIndex)

  const getStatusTone = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success'
      case 'Quoted':
        return 'info'
      case 'Pending Response':
        return 'warning'
      case 'Declined':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-blue-50/70 p-6 shadow-[0_20px_60px_rgba(16,185,129,0.16)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900">RFQs received</h1>
          <p className="text-xs text-neutral-600">
            Prioritise open RFQs to keep your win-rate high.
          </p>
        </div>

        <div className="mb-6">
          <FormField
            id="sellerRfqSearch"
            placeholder="Search RFQs by product, buyer or location..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setPage(1)
            }}
            icon={Search}
            wrapperClassName="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/80">
              <tr className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedRFQs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-500">
                    No RFQs received yet. When buyers send RFQs for your products, they will appear here.
                  </td>
                </tr>
              ) : (
                paginatedRFQs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="group bg-white/90 transition-colors hover:bg-emerald-50/60"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-neutral-900">{rfq.productName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-neutral-800">{rfq.buyer}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-neutral-800">{rfq.quantity.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-neutral-800">{rfq.location}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusTag tone={getStatusTone(rfq.status)}>{rfq.status}</StatusTag>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-neutral-700">{rfq.createdOn}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 text-xs font-semibold text-neutral-800 hover:border-brand-primary/60 hover:text-brand-primary"
                        onClick={() => navigate(`/seller/rfqs/${rfq.id}/respond`)}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        View / Respond
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default RFQInbox
