import PropTypes from 'prop-types'
import { icons } from 'lucide-react'

const iconMap = {
  settings: icons.Settings,
  leaf: icons.Leaf,
  heart: icons.HeartPulse,
  fabric: icons.UnfoldHorizontal,
  package: icons.Package,
  chip: icons.Cpu,
}

const CategoryGrid = ({ items, onSelect }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {items.map((category) => {
      const Icon = iconMap[category.icon] ?? icons.Tag
      return (
        <button
          key={category.id}
          onClick={() => onSelect(category)}
          className="group relative overflow-hidden rounded-3xl border border-gray-300 bg-gradient-to-br from-emerald-50/70 via-white/90 to-emerald-50/70 p-5 text-left backdrop-blur-sm shadow-[0_18px_48px_rgba(16,185,129,0.18)] transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-400/90 hover:via-emerald-100/95 hover:to-emerald-400/100 hover:shadow-[0_22px_64px_rgba(16,185,129,0.3)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <div className="mb-3 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 transition-colors duration-300 group-hover:bg-white group-hover:text-emerald-700">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-neutral-900">
            {category.name}
          </h3>
          <p className="mt-1.5 text-xs text-neutral-600 transition-colors duration-300 group-hover:text-neutral-700">
            {category.description}
          </p>
        </button>
      )
    })}
  </div>
)

CategoryGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.string,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default CategoryGrid
