import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react'
import FormField from '../../components/common/FormField.jsx'
import FileUpload from '../../components/common/FileUpload.jsx'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'
import StatusTag from '../../components/common/StatusTag.jsx'
import useFormValidation from '../../hooks/useFormValidation.js'
import {
  email as emailRule,
  gst,
  minLength,
  mobile,
  optionalCharacterLimit,
  required,
  positiveNumber,
} from '../../utils/validators.js'
import { submitSellerKYC, getSellerKYC } from '../../services/kycService.js'

const initialValues = {
  businessName: '',
  businessAddress: '',
  city: '',
  state: '',
  contactPerson: '',
  phone: '',
  email: '',
  gstNumber: '',
  yearsInBusiness: '',
  businessType: '',
}

const validationSchema = {
  businessName: [required('Business name'), minLength('Business name', 3), optionalCharacterLimit('Business name', 80)],
  businessAddress: [required('Business address'), minLength('Business address', 5), optionalCharacterLimit('Business address', 120)],
  city: [required('City'), minLength('City', 2)],
  state: [required('State'), minLength('State', 2)],
  contactPerson: [required('Contact person'), minLength('Contact person', 2)],
  phone: [mobile('Primary mobile')],
  email: [emailRule('Official email')],
  gstNumber: [gst('GST number')],
  yearsInBusiness: [required('Years in business'), positiveNumber('Years in business')],
  businessType: [required('Business type')],
}

const SellerKYCSubmission = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [kycStatus, setKycStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [certificateFile, setCertificateFile] = useState([])
  const [gstFile, setGstFile] = useState([])
  const [otherFiles, setOtherFiles] = useState([])

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema,
    { validateOnChange: false },
  )

  useEffect(() => {
    loadKYCStatus()
  }, [])

  const loadKYCStatus = async () => {
    try {
      setLoading(true)
      const response = await getSellerKYC()
      if (response.data) {
        setKycStatus(response.data)
        // Pre-fill form if KYC exists
        if (response.data.status !== 'Approved') {
          Object.keys(initialValues).forEach((key) => {
            if (response.data[key]) {
              values[key] = response.data[key]
            }
          })
        }
      }
    } catch (error) {
      console.error('Failed to load KYC status:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    if (certificateFile.length === 0) {
      alert('Certificate of Incorporation is required')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()

      // Add form fields
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key])
        }
      })

      // Add files
      if (certificateFile[0]) {
        formData.append('certificateOfIncorporation', certificateFile[0])
      }
      if (gstFile[0]) {
        formData.append('gstCertificate', gstFile[0])
      }
      otherFiles.forEach((file) => {
        formData.append('otherDocuments', file)
      })

      const response = await submitSellerKYC(formData)
      setKycStatus(response.data)
    } catch (error) {
      alert(error.message || 'Failed to submit KYC. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading KYC status...</p>
        </div>
      </div>
    )
  }

  // If KYC is approved, show success message
  if (kycStatus?.status === 'Approved') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">KYC Verified!</h2>
              <p className="text-neutral-600">
                Your seller account has been verified. You can now list products on the marketplace.
              </p>
            </div>
            <StatusTag tone="success">Verified</StatusTag>
            <div className="pt-4">
              <Button onClick={() => navigate('/seller/dashboard')} size="lg" className="rounded-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // If KYC is rejected, show rejection message
  if (kycStatus?.status === 'Rejected') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-red-50/80">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">KYC Rejected</h2>
              {kycStatus.rejectionReason && (
                <div className="mt-3 p-4 rounded-xl bg-white border border-rose-200">
                  <p className="text-sm font-semibold text-neutral-900 mb-1">Reason:</p>
                  <p className="text-sm text-neutral-700">{kycStatus.rejectionReason}</p>
                </div>
              )}
              <p className="text-neutral-600 mt-4">
                Please review the feedback and resubmit your KYC documents.
              </p>
            </div>
            <StatusTag tone="danger">Rejected</StatusTag>
            <div className="pt-4">
              <Button onClick={() => setKycStatus(null)} size="lg" className="rounded-full">
                Resubmit KYC
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // If KYC is pending, show pending message
  if (kycStatus?.status === 'Pending') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50/80 via-white to-amber-50/80">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">KYC Under Review</h2>
              <p className="text-neutral-600">
                Your KYC submission is being reviewed by our admin team. You will be notified once the review is complete.
              </p>
            </div>
            <StatusTag tone="warning">Pending Review</StatusTag>
            <div className="pt-4 space-y-2">
              <p className="text-xs text-neutral-500">
                Submitted on: {new Date(kycStatus.createdAt).toLocaleDateString()}
              </p>
              <Button onClick={() => navigate('/seller/dashboard')} variant="secondary" size="lg" className="rounded-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Show KYC submission form
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Seller Verification</h1>
        <p className="text-neutral-600">
          Complete your KYC to get verified and start listing products. All information will be reviewed by our admin team.
        </p>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Business Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="businessName"
                name="businessName"
                label="Business name"
                required
                placeholder="Nova Foods Ltd."
                value={values.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.businessName}
              />
              <FormField
                id="contactPerson"
                name="contactPerson"
                label="Contact person"
                required
                placeholder="John Doe"
                value={values.contactPerson}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.contactPerson}
              />
            </div>

            <FormField
              id="businessAddress"
              name="businessAddress"
              label="Business address"
              required
              placeholder="Plot 21, MIDC, Industrial Area"
              value={values.businessAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.businessAddress}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="city"
                name="city"
                label="City"
                required
                placeholder="Pune"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
              />
              <FormField
                id="state"
                name="state"
                label="State"
                required
                placeholder="Maharashtra"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.state}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Contact Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="phone"
                name="phone"
                label="Primary mobile"
                required
                type="tel"
                placeholder="+91 9876543210"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
              />
              <FormField
                id="email"
                name="email"
                label="Official email"
                required
                type="email"
                placeholder="ops@novafoods.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
              />
            </div>

            <FormField
              id="gstNumber"
              name="gstNumber"
              label="GST number (optional)"
              placeholder="27ABCDE1234F1Z5"
              value={values.gstNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.gstNumber}
            />
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Business Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="yearsInBusiness"
                name="yearsInBusiness"
                label="Years in business"
                required
                type="number"
                placeholder="5"
                value={values.yearsInBusiness}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.yearsInBusiness}
                helper="Number of years your business has been operating"
              />
              <FormField
                id="businessType"
                name="businessType"
                label="Business type"
                required
                as="select"
                value={values.businessType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.businessType}
              >
                <option value="">Select business type</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="trader">Trader</option>
                <option value="both">Both (Manufacturer & Trader)</option>
              </FormField>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Documents
            </h3>

            <FileUpload
              id="certificateOfIncorporation"
              label="Certificate of Incorporation"
              required
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              maxSize={10 * 1024 * 1024}
              value={certificateFile}
              onChange={setCertificateFile}
              helper="Upload your business registration certificate (PDF or image)"
            />

            <FileUpload
              id="gstCertificate"
              label="GST Certificate (optional)"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              maxSize={10 * 1024 * 1024}
              value={gstFile}
              onChange={setGstFile}
              helper="Upload your GST certificate if available"
            />

            <FileUpload
              id="otherDocuments"
              label="Other Documents (optional)"
              multiple
              maxFiles={5}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              maxSize={10 * 1024 * 1024}
              value={otherFiles}
              onChange={setOtherFiles}
              helper="Upload any additional supporting documents (max 5 files)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="rounded-full px-6"
              onClick={() => navigate('/seller/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="rounded-full px-8" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SellerKYCSubmission

