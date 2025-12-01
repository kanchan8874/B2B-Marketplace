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
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredRFQs = useMemo(() => {
    let result = rfqs

    // Text search on product/seller/buyer
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (rfq) =>
          rfq.productName.toLowerCase().includes(query) ||
          rfq.seller?.toLowerCase().includes(query) ||
          rfq.buyer?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((rfq) => rfq.status === statusFilter)
    }

    return result
  }, [rfqs, searchQuery, statusFilter])

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
            <Button
              variant="secondary"
              size="md"
              className={`gap-2 rounded-2xl px-4 py-2.5 text-sm ${
                showFilters ? 'border-neutral-400 bg-neutral-50' : ''
              }`}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'Pending Response', label: 'Pending response' },
              { id: 'Quoted', label: 'Quoted' },
              { id: 'Accepted', label: 'Accepted' },
              { id: 'Declined', label: 'Declined' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setStatusFilter(option.id)
                  setPage(1)
                }}
                className={`rounded-full border px-3 py-1.5 font-semibold transition-colors ${
                  statusFilter === option.id
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

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
                        variant="secondary"
                        className="h-8 gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 text-xs font-semibold text-neutral-800 hover:border-brand-primary/60 hover:text-brand-primary"
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

