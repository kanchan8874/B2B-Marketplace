import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Eye } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { RFQContext } from '../../context/RFQContext.jsx'

const ITEMS_PER_PAGE = 5

const RFQCenter = () => {
  const { rfqs } = useContext(RFQContext)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const filteredRFQs = useMemo(() => {
    if (!searchQuery) return rfqs
    const query = searchQuery.toLowerCase()
    return rfqs.filter(
      (rfq) =>
        rfq.productName.toLowerCase().includes(query) ||
        rfq.seller?.toLowerCase().includes(query) ||
        rfq.buyer?.toLowerCase().includes(query)
    )
  }, [rfqs, searchQuery])

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
      <div className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,98,254,0.08)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Requests For Quote</h1>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New RFQ
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <FormField
            id="rfqSearch"
            placeholder="Search RFQs by product or seller..."
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Side
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Seller
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Direction
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Expires In
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedRFQs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-neutral-500">
                    No RFQs found. Start sending requests from any product page.
                  </td>
                </tr>
              ) : (
                paginatedRFQs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-neutral-900">{rfq.productName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-700">Buy</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-700">{rfq.quantity.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-700">{rfq.seller || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusTag tone={getStatusTone(rfq.status)}>{rfq.status}</StatusTag>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          rfq.direction === 'In'
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {rfq.direction || 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-600">{rfq.expiresIn || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => navigate(`/buyer/rfq/${rfq.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        View Details
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

export default RFQCenter

