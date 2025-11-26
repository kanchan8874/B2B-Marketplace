import PropTypes from 'prop-types'
import { Building2 } from 'lucide-react'

const SellerInfoCard = ({ seller, city, state }) => (
  <div className="flex items-start gap-3 rounded-3xl border border-blue-50 bg-gradient-to-br from-blue-50/40 via-white/95 to-teal-50/40 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
    <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
      <Building2 className="h-6 w-6" aria-hidden />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Seller</p>
      <p className="text-sm font-semibold text-neutral-900">{seller}</p>
      <p className="text-xs text-neutral-600">
        {city}, {state}
      </p>
    </div>
  </div>
)

SellerInfoCard.propTypes = {
  seller: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
}

export default SellerInfoCard
