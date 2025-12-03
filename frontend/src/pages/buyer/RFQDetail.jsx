import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Inbox, Tag } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import { getRFQById } from '../../services/rfqService.js'

const RFQDetail = () => {
  const navigate = useNavigate()
  const { rfqId } = useParams()
  const [rfq, setRfq] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getRFQById(rfqId)
        if (!isMounted) return
        if (!data?.rfq) {
          setError('RFQ not found.')
        } else {
          setRfq(data.rfq)
          setResponses(data.responses || [])
        }
      } catch (err) {
        console.error('Failed to load RFQ details:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load RFQ details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [rfqId])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-sm text-neutral-600">Loading RFQ...</p>
        </div>
      </div>
    )
  }

  if (error || !rfq) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <Card className="border-red-200 bg-red-50">
          <p className="px-4 py-6 text-sm text-red-800">
            {error || 'RFQ not found. Please go back to your RFQ list and try again.'}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/buyer/rfqs')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to RFQs
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.9fr]">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-teal-50/70">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                RFQ Summary
              </p>
              <h1 className="mt-1 text-xl font-semibold text-neutral-900">
                {rfq.product?.name || 'Product RFQ'}
              </h1>
            </div>
            <StatusTag tone={getStatusTone(rfq.status)}>{rfq.status}</StatusTag>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-blue-100 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Quantity
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                {rfq.quantity?.toLocaleString?.() ?? '-'} units
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-blue-100 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Delivery location
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {[rfq.deliveryLocation?.city, rfq.deliveryLocation?.state, rfq.deliveryLocation?.country]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-blue-50 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Seller
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {rfq.seller?.name || rfq.seller?.companyName || 'Seller'}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-blue-50 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Timeline
              </p>
              <p className="text-xs text-neutral-700">
                Created:{' '}
                <span className="font-semibold">
                  {rfq.createdAt ? new Date(rfq.createdAt).toLocaleString() : 'N/A'}
                </span>
              </p>
              <p className="text-xs text-neutral-700">
                Expires:{' '}
                <span className="font-semibold">
                  {rfq.expiresAt ? new Date(rfq.expiresAt).toLocaleDateString() : 'N/A'}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/70">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-emerald-600" aria-hidden />
              <h2 className="text-lg font-semibold text-neutral-900">Seller responses</h2>
            </div>
            <p className="text-xs text-neutral-500">
              {responses.length === 0
                ? 'No quotes yet'
                : `${responses.length} quote${responses.length > 1 ? 's' : ''} received`}
            </p>
          </div>

          {responses.length === 0 ? (
            <div className="py-10 text-center text-sm text-neutral-600">
              No responses yet. Sellers will respond here once they quote.
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((resp) => (
                <div
                  key={resp._id}
                  className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm text-neutral-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Quote from
                      </p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {resp.seller?.name || resp.seller?.companyName || 'Seller'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Final price
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        ₹{resp.finalPrice?.toLocaleString?.() ?? '-'}
                      </p>
                    </div>
                  </div>
                  {resp.terms && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-neutral-700">
                      <Tag className="mt-0.5 h-3.5 w-3.5 text-neutral-500" aria-hidden />
                      <p className="whitespace-pre-wrap">{resp.terms}</p>
                    </div>
                  )}
                  <p className="mt-3 text-[11px] text-neutral-500">
                    Sent on {resp.createdAt ? new Date(resp.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default RFQDetail


