import PropTypes from 'prop-types'

const DataTable = ({ columns, data, toolbar }) => (
  <section className="space-y-4 rounded-3xl border border-surface-border bg-white p-6 shadow-card">
    {toolbar}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-surface-border text-left text-sm">
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} scope="col" className="px-4 py-3 font-semibold">
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
              {columns.map((column) => (
                <td key={column.accessor} className="px-4 py-4 align-top">
                  {typeof column.cell === 'function' ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  toolbar: PropTypes.node,
}

export default DataTable
