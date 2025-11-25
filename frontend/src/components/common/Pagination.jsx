import PropTypes from 'prop-types'
import Button from './Button.jsx'

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between rounded-2xl border border-surface-border bg-white px-4 py-3 text-sm">
    <Button variant="ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
      Previous
    </Button>
    <p className="text-neutral-600">
      Page {page} of {totalPages}
    </p>
    <Button variant="ghost" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
      Next
    </Button>
  </div>
)

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
