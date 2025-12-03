import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Crown } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import ProductForm from '../../components/seller/ProductForm.jsx'
import Button from '../../components/common/Button.jsx'
import { getSellerSubscription } from '../../services/subscriptionService.js'
import { createProduct, getProductById, updateProduct } from '../../services/productService.js'
import { getCategories } from '../../services/categoryService.js'
import { getSellerKYC } from '../../services/kycService.js'

const ProductEditor = ({ mode = 'create' }) => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(mode === 'create')
  const [saving, setSaving] = useState(false)
  const [initialValues, setInitialValues] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [kycStatus, setKycStatus] = useState(null)
  const [kycLoading, setKycLoading] = useState(true)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
    if (mode === 'create') {
      loadSubscription()
    }
    loadSellerKYC()
    if (mode === 'edit' && productId) {
      loadProduct()
    }
  }, [mode, productId])

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

  const loadSellerKYC = async () => {
    try {
      setKycLoading(true)
      const response = await getSellerKYC()
      if (response.data) {
        setKycStatus(response.data.status)
      } else {
        setKycStatus(null)
      }
    } catch (error) {
      console.error('Failed to load seller KYC status:', error)
    } finally {
      setKycLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getProductById(productId)
      if (!data) {
        setError('Product not found.')
      } else {
        setInitialValues({
          name: data.name || '',
          description: data.description || '',
          priceMin: data.priceMin || '',
          priceMax: data.priceMax || '',
          moq: data.moq || '',
          category: data.category?._id || data.category || '',
          location: [data.city, data.state].filter(Boolean).join(', '),
          sku: data.sku || '',
          stock: data.stock || '',
          subcategory: data.subcategory || '',
          priceValidityDate: data.priceValidityDate ? data.priceValidityDate.slice(0, 10) : '',
          paymentTerms: data.paymentTerms || '',
          shipmentMode: data.shipmentMode || '',
        })
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      setError(error.message || 'Failed to load product.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values) => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      // Parse location into city/state
      const parts = (values.location || '').split(',').map((p) => p.trim())
      const city = parts[0] || ''
      const state = parts[1] || ''

      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('shortDescription', values.description || '')
      formData.append('description', values.description || '')
      formData.append('category', values.category)
      formData.append('priceMin', Number(values.priceMin))
      formData.append('priceMax', Number(values.priceMax))
      formData.append('moq', Number(values.moq))
      if (city) formData.append('city', city)
      if (state) formData.append('state', state)
      if (values.priceValidityDate) formData.append('priceValidityDate', values.priceValidityDate)
      if (values.paymentTerms) formData.append('paymentTerms', values.paymentTerms)
      if (values.shipmentMode) formData.append('shipmentMode', values.shipmentMode)

      // Attach up to 4 media files as 'images'
      if (Array.isArray(values.mediaFiles)) {
        values.mediaFiles.slice(0, 4).forEach((file) => {
          if (file) {
            formData.append('images', file)
          }
        })
      }

      if (mode === 'create') {
        await createProduct(formData)
        setSuccess('Product created successfully.')
      } else {
        await updateProduct(productId, formData)
        setSuccess('Product updated successfully.')
      }

      // Redirect back to seller products after short delay
      setTimeout(() => {
        navigate('/seller/products', { replace: true })
      }, 600)
    } catch (error) {
      console.error('Failed to save product:', error)
      setError(error.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading && (mode === 'create' || (mode === 'edit' && !initialValues))) {
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

  // While checking KYC status for create mode, show lightweight loader
  if (mode === 'create' && kycLoading) {
    return (
      <section className="mx-auto max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-sm text-neutral-600">Checking your verification status...</p>
          </div>
        </div>
      </section>
    )
  }

  // Require KYC approval before allowing product creation
  if (mode === 'create' && !kycLoading && kycStatus !== 'Approved') {
    return (
      <section className="mx-auto max-w-3xl">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/80">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-neutral-900">Complete seller verification</h2>
            <p className="text-sm text-neutral-700 max-w-xl mx-auto">
              You need an approved KYC profile before you can list products. This helps buyers trust
              your catalogue and keeps the marketplace compliant.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                size="lg"
                className="rounded-full px-6"
                onClick={() => navigate('/seller/kyc')}
              >
                Go to KYC verification
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="rounded-full px-6"
                onClick={() => navigate('/seller/dashboard')}
              >
                Back to dashboard
              </Button>
            </div>
            {kycStatus && (
              <p className="text-xs text-neutral-500">
                Current KYC status: <span className="font-semibold">{kycStatus}</span>
              </p>
            )}
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
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        )}
        <ProductForm
          submitLabel={saving ? 'Saving...' : mode === 'create' ? 'Publish product' : 'Save changes'}
          onSubmit={handleSubmit}
          categories={categories}
          initialValues={mode === 'edit' ? initialValues : undefined}
        />
      </Card>
    </section>
  )
}

ProductEditor.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
}

export default ProductEditor
