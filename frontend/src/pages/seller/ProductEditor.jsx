import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Crown } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import ProductForm from '../../components/seller/ProductForm.jsx'
import Button from '../../components/common/Button.jsx'
import { getSellerSubscription } from '../../services/subscriptionService.js'

const ProductEditor = ({ mode = 'create' }) => {
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(mode === 'create')

  useEffect(() => {
    if (mode === 'create') {
      loadSubscription()
    }
  }, [mode])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const response = await getSellerSubscription()
      if (response.data) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'create' && loading) {
    return (
      <section className="mx-auto max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-sm text-neutral-600">Checking subscription limits...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show limit reached message for create mode
  if (mode === 'create' && subscription && !subscription.canAddMore) {
    return (
      <section className="mx-auto max-w-4xl">
        <Card className="border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-red-50/80">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Product Limit Reached</h2>
              <p className="text-neutral-600 mb-4">
                You've reached your {subscription.tier} tier limit of {subscription.productLimit} products.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2">
                <Crown className="h-5 w-5 text-rose-700" />
                <span className="text-sm font-semibold text-rose-900">
                  Current: {subscription.currentProductCount} / {subscription.productLimit} products
                </span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <p className="text-sm text-neutral-600">
                Upgrade to a higher tier to add more products:
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border-2 border-neutral-200 bg-white p-4">
                  <p className="text-sm font-semibold text-neutral-900">Silver</p>
                  <p className="text-xs text-neutral-500 mt-1">10 products</p>
                </div>
                <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-4">
                  <p className="text-sm font-semibold text-yellow-900">Gold</p>
                  <p className="text-xs text-yellow-700 mt-1">50 products</p>
                </div>
                <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-4">
                  <p className="text-sm font-semibold text-purple-900">Platinum</p>
                  <p className="text-xs text-purple-700 mt-1">200 products</p>
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={() => navigate('/seller/products')} variant="secondary" size="lg" className="rounded-full">
                  Back to Products
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl">
      {mode === 'create' && subscription && subscription.remainingSlots <= 3 && (
        <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-1">Running Low on Product Slots</p>
              <p className="text-xs text-yellow-800">
                You have {subscription.remainingSlots} product slot{subscription.remainingSlots > 1 ? 's' : ''} remaining
                in your {subscription.tier} tier. Consider upgrading to add more products.
              </p>
            </div>
          </div>
        </div>
      )}
      <Card
        title={mode === 'create' ? 'Add a new product' : 'Update product'}
        subtitle="Minimal, structured fields to keep your catalogue clean and approvals fast."
        className="border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/60 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
      >
        <ProductForm submitLabel={mode === 'create' ? 'Publish product' : 'Save changes'} />
      </Card>
    </section>
  )
}

ProductEditor.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
}

export default ProductEditor
