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
          className="group rounded-[28px] border border-white/80 bg-white/95 p-6 text-left shadow-[0_25px_60px_rgba(15,98,254,0.08)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(15,98,254,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          <div className="mb-4 inline-flex rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{category.name}</h3>
          <p className="mt-2 text-sm text-neutral-600">{category.description}</p>
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
