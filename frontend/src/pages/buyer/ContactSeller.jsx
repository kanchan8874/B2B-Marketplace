import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import { required, minLength, characterLimit } from '../../utils/validators.js'
import { sendMessage } from '../../services/messageService.js'
import { products } from '../../mocks/products.js'

const initialValues = {
  subject: '',
  body: '',
}

const validationSchema = {
  subject: [required('Subject'), minLength('Subject', 3), characterLimit('Subject', 3, 200)],
  body: [required('Message'), minLength('Message', 10), characterLimit('Message', 10, 2000)],
}

const ContactSeller = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sellerId, setSellerId] = useState(null)

  const product = useMemo(() => {
    if (productId) {
      return products.find((p) => p.id === productId)
    }
    return null
  }, [productId])

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  useEffect(() => {
    if (product && !values.subject) {
      // Auto-fill subject with product name
      const subject = `Inquiry about ${product.name}`
      handleChange({ target: { name: 'subject', value: subject } })
    }
    // For mock data, we'll use a placeholder sellerId
    // In real app, this would come from the product's seller field
    if (product && !sellerId) {
      // Mock sellerId - in real app, this would be product.sellerId
      setSellerId('seller-1') // Placeholder
    }
  }, [product])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm() || !sellerId) return

    try {
      setSubmitting(true)
      await sendMessage(sellerId, productId || undefined, values.subject, values.body)
      setSubmitted(true)
      resetForm()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert(error.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/80">
          <div className="text-center space-y-4 py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Message Sent Successfully!</h2>
              <p className="text-neutral-600 mb-4">
                Your message has been sent to the seller. They will receive an email notification and can respond
                through their inbox.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/buyer/messages')} size="lg" className="rounded-full">
                View Messages
              </Button>
              <Button
                onClick={() => navigate(productId ? `/buyer/products/${productId}` : '/buyer/products')}
                variant="secondary"
                size="lg"
                className="rounded-full"
              >
                Back to Product
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </button>

      <Card
        title="Contact Seller"
        subtitle={product ? `Send a message to the seller about ${product.name}` : 'Send a message to the seller'}
        className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 shadow-[0_20px_60px_rgba(37,99,235,0.14)]"
      >
        {product && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Product</p>
            <p className="text-base font-semibold text-neutral-900">{product.name}</p>
            <p className="text-sm text-neutral-600 mt-1">{product.shortDescription}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField
            id="subject"
            name="subject"
            label="Subject"
            required
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.subject}
            placeholder="e.g., Inquiry about product specifications"
          />

          <FormField
            id="body"
            name="body"
            label="Message"
            required
            as="textarea"
            rows={8}
            value={values.body}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.body}
            helper="Include your requirements, quantity, delivery location, and any specific questions."
            placeholder="Write your message here..."
          />

          <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="rounded-full px-6"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="rounded-full px-8 flex items-center gap-2" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ContactSeller

