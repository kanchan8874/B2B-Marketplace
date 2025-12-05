import PropTypes from 'prop-types'

const DataTable = ({ columns, data, toolbar }) => {
  // Helper to safely convert value to renderable format
  const safeValue = (value) => {
    if (value === null || value === undefined) {
      return '—'
    }
    // If it's an object, try to extract a meaningful string
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Try common object properties
      if (value.name) return value.name
      if (value.title) return value.title
      if (value.email) return value.email
      if (value.companyName) return value.companyName
      if (value.businessName) return value.businessName
      // If it has _id, it's likely a populated object - return a fallback
      if (value._id) return '—'
      // Last resort: stringify (but this shouldn't happen)
      return String(value)
    }
    // For arrays, join them
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '—'
    }
    // For primitives, return as is
    return value
  }

  // Helper to get cell value
  const getCellValue = (column, row) => {
    if (typeof column.cell === 'function') {
      return column.cell(row)
    }
    if (typeof column.accessor === 'function') {
      const result = column.accessor(row)
      return safeValue(result)
    }
    const value = row[column.accessor]
    return safeValue(value)
  }

  // Helper to get unique key for column
  const getColumnKey = (column, index) => {
    if (typeof column.accessor === 'string') {
      return column.accessor
    }
    return `col-${index}-${column.header}`
  }

  return (
    <section className="space-y-4 rounded-3xl border border-surface-border bg-white p-6 shadow-card">
      {toolbar}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-border text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              {columns.map((column, colIndex) => (
                <th key={getColumnKey(column, colIndex)} scope="col" className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border bg-white text-neutral-700">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="transition hover:bg-brand-primary/5 focus-within:bg-brand-primary/5"
              >
                {columns.map((column, colIndex) => (
                  <td key={getColumnKey(column, colIndex)} className="px-4 py-4 align-top">
                    {getCellValue(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  toolbar: PropTypes.node,
}

export default DataTable
