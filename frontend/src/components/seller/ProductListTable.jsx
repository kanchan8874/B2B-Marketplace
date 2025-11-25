import PropTypes from 'prop-types'
import Button from '../common/Button.jsx'
import DataTable from '../common/DataTable.jsx'
import ProductStatusBadge from './ProductStatusBadge.jsx'

const ProductListTable = ({ items, onEdit, onDelete }) => {
  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.name}</p>
          <p className="text-sm text-neutral-500">{row.shortDescription}</p>
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
          <Button variant="ghost" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button variant="ghost" className="text-status-danger" onClick={() => onDelete(row)}>
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default ProductListTable
