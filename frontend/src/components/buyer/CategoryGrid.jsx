import PropTypes from 'prop-types'

// Category images mapping
const categoryImages = {
  'Industrial Supplies': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  'Food & Agriculture': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80',
  'Health & Pharma': 'https://images.unsplash.com/photo-1580281780460-82d277b0c30d?auto=format&fit=crop&w=800&q=80',
  'Textiles & Apparel': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  'Packaging': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
}

const CategoryGrid = ({ items, onSelect }) => (
  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
    {items.map((category) => {
      const categoryImage = categoryImages[category.name] || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80'
      
      return (
        <button
          key={category.id}
          onClick={() => onSelect(category)}
          className="group relative aspect-square overflow-hidden rounded-4xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {/* Category Image */}
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={categoryImage}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80'
              }}
            />
            {/* Gradient Overlay - Darker at bottom for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            
            {/* Category Name */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              {/* Semi-transparent background for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent -z-10" />
              <h3 className="text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-2 text-sm font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>
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
