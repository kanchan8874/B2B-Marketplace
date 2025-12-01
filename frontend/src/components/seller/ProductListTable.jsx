import PropTypes from 'prop-types'
import Button from '../common/Button.jsx'
import DataTable from '../common/DataTable.jsx'
import ProductStatusBadge from './ProductStatusBadge.jsx'

const ProductListTable = ({ items, onView, onEdit, onDelete }) => {
  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* Circular thumbnail */}
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
            <img
              src={row.gallery?.[0] || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=200&q=80'}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{row.name}</p>
            <p className="text-xs text-neutral-500 line-clamp-1">{row.shortDescription}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Price range',
      accessor: 'price',
      cell: (row) => `₹${row.priceMin} – ₹${row.priceMax}`,
    },
    {
      header: 'MOQ',
      accessor: 'moq',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <ProductStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-3 text-xs"
            onClick={() => onView?.(row)}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full px-3 text-xs"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="rounded-full px-3 text-xs"
            onClick={() => onDelete(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={items} />
}

ProductListTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default ProductListTable

