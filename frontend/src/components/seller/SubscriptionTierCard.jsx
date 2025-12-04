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
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const response = await getSellerSubscription()
      if (response.data) {
        const previousTier = window.localStorage.getItem('sellerSubscriptionTier')
        const currentTier = response.data.tier

        // Store latest tier for future comparisons
        if (currentTier) {
          window.localStorage.setItem('sellerSubscriptionTier', currentTier)
        }

        // If tier changed compared to last seen, show celebration card
        if (previousTier && currentTier && previousTier !== currentTier) {
          setShowCelebration(true)
        }

        setSubscription(response.data)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showCelebration) return

    const timeout = setTimeout(() => {
      setShowCelebration(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [showCelebration])

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/2 rounded bg-neutral-200" />
          <div className="h-4 w-3/4 rounded bg-neutral-200" />
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
    <>
      {showCelebration && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rotate-12 bg-gradient-to-br from-amber-300 via-pink-300 to-sky-400 opacity-60 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 -rotate-12 bg-gradient-to-br from-emerald-300 via-sky-300 to-violet-400 opacity-60 blur-3xl" />

            <div className="relative z-10 space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-md">
                <Crown className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Subscription upgraded!</h2>
              <p className="text-sm text-neutral-600">
                Your plan has been upgraded to the{' '}
                <span className="font-semibold text-neutral-900">{subscription.tier}</span> tier. You can now publish
                more live products and grow your catalogue.
              </p>
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
                <span>{subscription.currentProductCount} / {subscription.productLimit} listings</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="mt-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
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
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="mb-1 text-xs font-semibold text-rose-900">Product Limit Reached</p>
              <p className="text-xs text-rose-700">
                You've reached your {subscription.tier} tier limit of {subscription.productLimit} products. Upgrade to
                add more products.
              </p>
            </div>
          )}

          {subscription.remainingSlots > 0 && subscription.remainingSlots <= 3 && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
              <p className="mb-1 text-xs font-semibold text-yellow-900">Running Low</p>
              <p className="text-xs text-yellow-700">
                Only {subscription.remainingSlots} product slot{subscription.remainingSlots > 1 ? 's' : ''} remaining.
                Consider upgrading your plan.
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

SubscriptionTierCard.propTypes = {}

export default SubscriptionTierCard

