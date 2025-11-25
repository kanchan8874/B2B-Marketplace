import PropTypes from 'prop-types'
import Button from '../common/Button.jsx'

const ApprovalToggle = ({ approved, onToggle }) => (
  <Button
    type="button"
    variant={approved ? 'ghost' : 'primary'}
    className={approved ? 'text-status-danger' : ''}
    onClick={onToggle}
  >
    {approved ? 'Reject' : 'Approve'}
  </Button>
)

ApprovalToggle.propTypes = {
  approved: PropTypes.bool,
  onToggle: PropTypes.func,
}

export default ApprovalToggle
