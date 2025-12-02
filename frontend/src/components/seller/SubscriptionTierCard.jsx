import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Crown, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '../common/Card.jsx'
import { getSellerSubscription } from '../../services/subscriptionService.js'

const tierColors = {
  Silver: {
    bg: 'bg-neutral-100',
    border: 'border-neutral-300',
    text: 'text-neutral-700',
    badge: 'bg-neutral-200 text-neutral-800',
  },
  Gold: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
    badge: 'bg-yellow-200 text-yellow-900',
  },
  Platinum: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    badge: 'bg-purple-200 text-purple-900',
  },
}

const SubscriptionTierCard = () => {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscription()
  }, [])

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

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        </div>
      </Card>
    )
  }

  if (!subscription) {
    return null
  }

  const colors = tierColors[subscription.tier] || tierColors.Silver
  const percentageUsed = (subscription.currentProductCount / subscription.productLimit) * 100

  return (
    <Card className={`${colors.bg} border-2 ${colors.border}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className={`h-6 w-6 ${colors.text}`} />
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Subscription Plan</h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                {subscription.tier} Tier
              </span>
            </div>
          </div>
          {subscription.canAddMore ? (
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Product Listings</span>
            <span className="font-semibold text-neutral-900">
              {subscription.currentProductCount} / {subscription.productLimit}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentageUsed >= 90
                  ? 'bg-rose-500'
                  : percentageUsed >= 70
                    ? 'bg-yellow-500'
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              {subscription.remainingSlots > 0
                ? `${subscription.remainingSlots} slots remaining`
                : 'Limit reached'}
            </span>
            <span className="font-medium text-neutral-700">{Math.round(percentageUsed)}% used</span>
          </div>
        </div>

        {!subscription.canAddMore && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
            <p className="text-xs font-semibold text-rose-900 mb-1">Product Limit Reached</p>
            <p className="text-xs text-rose-700">
              You've reached your {subscription.tier} tier limit of {subscription.productLimit} products. Upgrade to
              add more products.
            </p>
          </div>
        )}

        {subscription.remainingSlots > 0 && subscription.remainingSlots <= 3 && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-xs font-semibold text-yellow-900 mb-1">Running Low</p>
            <p className="text-xs text-yellow-700">
              Only {subscription.remainingSlots} product slot{subscription.remainingSlots > 1 ? 's' : ''} remaining.
              Consider upgrading your plan.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

SubscriptionTierCard.propTypes = {}

export default SubscriptionTierCard

