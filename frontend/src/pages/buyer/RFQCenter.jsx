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
      <div className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.14)]">
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
          <table className="w-full text-left text-sm">
            <thead className="bg-white/80">
              <tr className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Product
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
                  <tr
                    key={rfq.id}
                    className="group bg-white/90 transition-colors hover:bg-blue-50/60"
                  >
                    <td className="px-4 py-4 first:rounded-l-2xl">
                      <p className="font-semibold text-neutral-900">{rfq.productName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-neutral-800">{rfq.quantity.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-neutral-800">{rfq.seller || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusTag tone={getStatusTone(rfq.status)}>{rfq.status}</StatusTag>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-neutral-700">{rfq.expiresIn || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4 last:rounded-r-2xl">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 text-xs font-semibold text-neutral-800 hover:border-brand-primary/60 hover:text-brand-primary"
                        onClick={() => navigate(`/buyer/rfq/${rfq.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        View details
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

