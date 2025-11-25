import PropTypes from 'prop-types'
import { Building2 } from 'lucide-react'

const SellerInfoCard = ({ seller, city, state }) => (
  <div className="flex items-start gap-4 rounded-3xl border border-surface-border bg-neutral-50 p-4">
    <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
      <Building2 className="h-6 w-6" aria-hidden />
    </div>
    <div>
      <p className="text-sm uppercase tracking-wide text-neutral-500">Seller</p>
      <p className="text-lg font-semibold text-neutral-900">{seller}</p>
      <p className="text-neutral-600">
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
