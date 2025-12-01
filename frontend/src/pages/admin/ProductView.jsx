import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Layers, Package, Tag, Users } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import { products } from '../../mocks/products.js'
import { rfqs } from '../../mocks/rfqs.js'

const AdminProductView = () => {
  const { productId } = useParams()
  const navigate = useNavigate()

  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0],
    [productId],
  )

  const hydratedImages =
    product.gallery?.length > 0
      ? product.gallery.map((img) =>
          img?.startsWith('http')
            ? img
            : 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
        )
      : ['https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80']

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [productStatus, setProductStatus] = useState('Live')
  const [pendingAction, setPendingAction] = useState(null)
  const [isArchived, setIsArchived] = useState(false)

  const relatedRFQs = rfqs.filter((rfq) => rfq.productName === product.name)

  const handleConfirmAction = () => {
    if (!pendingAction) return

    if (pendingAction.type === 'publish') {
      setProductStatus('Live')
    } else if (pendingAction.type === 'unpublish') {
      setProductStatus('Unpublished')
    } else if (pendingAction.type === 'delete') {
      setIsArchived(true)
      setProductStatus('Archived')
    }

    setPendingAction(null)
  }

  const handleCancelAction = () => {
    setPendingAction(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to products
        </button>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full px-4 text-xs"
          onClick={() => navigate('/admin/products')}
        >
          Back to moderation
        </Button>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] items-stretch">
        {/* Left: hero image */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-4xl bg-neutral-100 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            <img
              src={hydratedImages[activeImageIndex] || hydratedImages[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-300"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
              }}
            />

            {/* Dot indicators */}
            {hydratedImages.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                {hydratedImages.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full border border-white/80 transition-all ${
                      activeImageIndex === index
                        ? 'bg-white'
                        : 'bg-black/30 hover:bg-black/50'
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: meta + usage */}
        <div className="flex flex-col">
          <Card
            title={product.name}
            subtitle={product.shortDescription}
            className="flex h-full flex-1 flex-col border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/50 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
          >
            <div className="flex h-full flex-col justify-between space-y-8 text-sm text-neutral-700">
              {/* Seller block */}
              <section className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Seller
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Primary supplier</p>
                    <p className="mt-0.5 text-base font-semibold text-neutral-900">
                      {product.seller}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Admin view
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-3 text-xs"
                      disabled={isArchived}
                      onClick={() =>
                        setPendingAction({
                          type: productStatus === 'Live' ? 'unpublish' : 'publish',
                        })
                      }
                    >
                      {productStatus === 'Live' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="rounded-full px-3 text-xs"
                      disabled={isArchived}
                      onClick={() => setPendingAction({ type: 'delete' })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {isArchived && (
                  <div className="mt-3 rounded-2xl border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-xs text-status-danger">
                    This product has been archived and is no longer visible to buyers. Restore by
                    publishing a new version from the seller side.
                  </div>
                )}
              </section>

              {/* Commercials + Logistics */}
              <section className="grid gap-8 border-t border-neutral-100 pt-6 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Commercials
                  </p>
                  <dl className="space-y-4">
                    <div className="space-y-1">
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        <Package className="h-4 w-4 text-neutral-500" />
                        Price band
                      </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        ₹{product.priceMin.toLocaleString()} – ₹{product.priceMax.toLocaleString()}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        <Layers className="h-4 w-4 text-neutral-500" />
                        MOQ
                      </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        {product.moq.toLocaleString()} units
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Logistics &amp; classification
                  </p>
                  <dl className="space-y-4">
                    <div className="space-y-1">
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        <MapPin className="h-4 w-4 text-neutral-500" />
                        Dispatch city / state
                      </dt>
                      <dd className="text-base font-semibold text-neutral-900">
                        {product.city}, {product.state}
                      </dd>
                    </div>
                    {product.categoryId && (
                      <div className="space-y-1">
                        <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                          <Tag className="h-4 w-4 text-neutral-500" />
                          Category
                        </dt>
                        <dd className="text-base font-semibold text-neutral-900">
                          {product.categoryId}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>

              {/* RFQ usage */}
              <section className="space-y-3 border-t border-neutral-100 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  RFQ usage
                </p>
                {relatedRFQs.length > 0 ? (
                  <div className="space-y-2 text-xs text-neutral-700">
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-neutral-500" />
                      <span className="font-semibold text-neutral-900">
                        {relatedRFQs.length} RFQs
                      </span>
                      <span className="text-neutral-500">raised on this product</span>
                    </p>
                    <ul className="space-y-1.5">
                      {relatedRFQs.slice(0, 3).map((rfq) => (
                        <li key={rfq.id} className="flex justify-between gap-4">
                          <span className="truncate text-neutral-600">
                            {rfq.buyer} • {rfq.quantity.toLocaleString()} units
                          </span>
                          <span className="text-right text-[11px] font-medium text-neutral-500">
                            {rfq.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500">
                    No RFQs have been raised on this product yet.
                  </p>
                )}
              </section>
            </div>
          </Card>
        </div>
      </section>
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
            <h2 className="text-lg font-semibold text-neutral-900">
              {pendingAction.type === 'delete'
                ? 'Delete product?'
                : pendingAction.type === 'unpublish'
                ? 'Unpublish product?'
                : 'Publish product?'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              You&apos;re about to{' '}
              <span className="font-semibold text-neutral-900">
                {pendingAction.type === 'delete'
                  ? 'delete'
                  : pendingAction.type === 'unpublish'
                  ? 'unpublish'
                  : 'publish'}
              </span>{' '}
              <span className="font-semibold text-neutral-900">{product.name}</span>. This change
              will affect how buyers and sellers see this SKU across the marketplace.
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs text-neutral-700">
              <p className="flex justify-between gap-4">
                <span className="text-neutral-500">Seller</span>
                <span className="font-semibold text-neutral-900">{product.seller}</span>
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="text-neutral-500">Price band</span>
                <span className="font-semibold text-neutral-900">
                  ₹{product.priceMin.toLocaleString()} – ₹{product.priceMax.toLocaleString()}
                </span>
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="text-neutral-500">Current status</span>
                <span className="font-semibold text-neutral-900">{productStatus}</span>
              </p>
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
                {pendingAction.type === 'delete'
                  ? 'Delete product'
                  : pendingAction.type === 'unpublish'
                  ? 'Unpublish'
                  : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductView


