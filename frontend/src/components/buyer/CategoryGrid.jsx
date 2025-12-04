import PropTypes from 'prop-types'

const CategoryGrid = ({ items, onSelect }) => (
  // Responsive grid – clean, card-style layout
  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {items.map((category) => {
      const categoryImage = category.image || null

      return (
        <button
          key={category.id || category._id}
          onClick={() => onSelect(category)}
          className="group relative aspect-[5/4] overflow-hidden rounded-[5px] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.12)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.2)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2  text-center  "
        >
          {/* Background image */}
          <div className="relative h-full w-full overflow-hidden">
            {categoryImage ? (
              <img
                src={categoryImage}
                alt={category.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 saturate-115 contrast-110 brightness-105"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                <p className="text-sm font-semibold text-neutral-600">{category.name}</p>
              </div>
            )}

            {/* Bottom-focused gradient – keeps image clear, darkens lower area for text */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/100 via-black/45 to-transparent" />

            {/* Text content slightly above bottom, centered horizontally */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center px-4 pb-5">
              <h3 className="text-xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-snug">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-2 text-sm text-slate-100/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] leading-relaxed line-clamp-2">
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
      id: PropTypes.string,
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.string,
      image: PropTypes.string, // Image URL from first product in category
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default CategoryGrid
