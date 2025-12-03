import { Link } from 'react-router-dom'
import { Users, Store, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'

// Mock data - in real app, this would come from API
const sellerKYCStats = {
  pending: 5,
  approved: 12,
  rejected: 2,
}

const buyerKYCStats = {
  pending: 3,
  approved: 8,
  rejected: 1,
}

const KYCOverview = () => {
  const totalSellerKYC = sellerKYCStats.pending + sellerKYCStats.approved + sellerKYCStats.rejected
  const totalBuyerKYC = buyerKYCStats.pending + buyerKYCStats.approved + buyerKYCStats.rejected
  const verificationHealth = totalSellerKYC + totalBuyerKYC > 0 
    ? Math.round(((sellerKYCStats.approved + buyerKYCStats.approved) / (totalSellerKYC + totalBuyerKYC)) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">KYC Management</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Review and manage seller and buyer verification submissions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Seller KYC Summary */}
        <Card
          className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 to-blue-100/40 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-700" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                  Seller KYC
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Pending</span>
                  <span className="text-lg font-bold text-blue-900">{sellerKYCStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Approved</span>
                  <span className="text-lg font-bold text-emerald-700">{sellerKYCStats.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Rejected</span>
                  <span className="text-lg font-bold text-red-700">{sellerKYCStats.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Buyer KYC Summary */}
        <Card
          className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/80 to-teal-100/40 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-700" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-900">
                  Buyer KYC
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-700">Pending</span>
                  <span className="text-lg font-bold text-teal-900">{buyerKYCStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-700">Approved</span>
                  <span className="text-lg font-bold text-emerald-700">{buyerKYCStats.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-700">Rejected</span>
                  <span className="text-lg font-bold text-red-700">{buyerKYCStats.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Verification Health */}
        <Card
          className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                  Verification Health
                </h3>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-900">{verificationHealth}%</span>
                  <span className="text-xs text-emerald-700">Approved</span>
                </div>
                <p className="mt-2 text-xs text-emerald-700">
                  {sellerKYCStats.approved + buyerKYCStats.approved} of {totalSellerKYC + totalBuyerKYC} verified
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Action Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Seller KYC Review Card */}
        <Card
          title="Seller KYC Review"
          subtitle={`${sellerKYCStats.pending} submissions awaiting review`}
          className="border-2 border-blue-200 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          actions={
            <Button
              as={Link}
              to="/admin/kyc/sellers"
              variant="primary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <span>Review Seller KYCs</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>
                <strong className="font-semibold text-blue-900">{sellerKYCStats.pending}</strong> pending
                verification
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>
                <strong className="font-semibold text-emerald-900">{sellerKYCStats.approved}</strong> approved
                sellers
              </span>
            </div>
            <p className="text-xs text-neutral-600">
              Review business documents, GST certificates, and business details for seller verification.
            </p>
          </div>
        </Card>

        {/* Buyer KYC Review Card */}
        <Card
          title="Buyer KYC Review"
          subtitle={`${buyerKYCStats.pending} submissions awaiting review`}
          className="border-2 border-teal-200 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          actions={
            <Button
              as={Link}
              to="/admin/kyc/buyers"
              variant="primary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <span>Review Buyer KYCs</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <Clock className="h-5 w-5 text-teal-600" />
              <span>
                <strong className="font-semibold text-teal-900">{buyerKYCStats.pending}</strong> pending
                verification
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-700">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>
                <strong className="font-semibold text-emerald-900">{buyerKYCStats.approved}</strong> approved
                buyers
              </span>
            </div>
            <p className="text-xs text-neutral-600">
              Review business registration documents and contact details for buyer verification.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default KYCOverview
