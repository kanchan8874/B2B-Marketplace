import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import RFQResponseForm from '../../components/seller/RFQResponseForm.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import { getRFQById } from '../../services/rfqService.js'

const RFQResponse = () => {
  const { rfqId } = useParams()
  const [rfqData, setRfqData] = useState(null)
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
        if (!data) {
          setError('RFQ not found.')
        } else {
          setRfqData(data)
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

  // Always define hooks (useMemo) before any early returns to keep hook order stable
  const rfq = rfqData?.rfq || null
  const product = useMemo(() => (rfq ? rfq.product : null), [rfq])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-brand-primary" />
          <p className="text-sm text-neutral-600">Loading RFQ...</p>
        </div>
      </div>
    )
  }

  if (error || !rfq) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800">
          {error || 'RFQ not found. Please go back to RFQ inbox and try again.'}
        </div>
      </div>
    )
  }

  const mainImage =
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card
        title={product?.name || 'Product'}
        subtitle={`Buyer · ${rfq.buyer?.name || rfq.buyer?.companyName || 'Buyer'}`}
        className="border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white/95 to-blue-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.16)]"
      >
        <div className="grid gap-6 text-sm md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] items-stretch">
          {/* RFQ details on the left */}
          <div className="space-y-4">
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">RFQ ID</dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold text-neutral-900">{rfq._id}</dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Quantity</dt>
              <dd className="mt-0.5 text-lg font-semibold text-neutral-900">
                {rfq.quantity?.toLocaleString?.() ?? '-'} units
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Requested on</dt>
              <dd className="mt-0.5 text-sm font-medium text-neutral-800">
                {rfq.createdAt ? new Date(rfq.createdAt).toLocaleDateString() : '—'}
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Status</dt>
              <dd className="mt-0.5">
                <StatusTag tone={rfq.status === 'Quoted' ? 'success' : 'warning'}>
                  {rfq.status || 'Pending Response'}
                </StatusTag>
              </dd>
            </dl>
            <dl className="space-y-1">
              <dt className="text-neutral-500 text-xs uppercase tracking-[0.16em]">Delivery location</dt>
              <dd className="mt-0.5 text-lg font-semibold text-neutral-900">
                {[rfq.deliveryLocation?.city, rfq.deliveryLocation?.state, rfq.deliveryLocation?.country]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </dd>
            </dl>
          </div>

          {/* Large product image on the right */}
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-neutral-100">
            <img src={mainImage} alt={rfq.productName} className="h-full w-full object-cover" />
          </div>
        </div>
      </Card>

      <Card
        title="Respond to RFQ"
        subtitle="Share final price and commercial terms in one compact view."
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_18px_50px_rgba(37,99,235,0.16)]"
      >
        <RFQResponseForm rfqId={rfq._id} />
      </Card>
    </div>
  )
}

export default RFQResponse
