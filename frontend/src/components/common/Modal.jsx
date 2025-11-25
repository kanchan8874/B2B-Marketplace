import PropTypes from 'prop-types'

const Modal = ({ title, children, onClose, actions }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 px-4 py-8">
    <div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-card">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <button
          onClick={onClose}
          className="rounded-full border border-transparent p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>
      <div className="space-y-4">{children}</div>
      {actions && <div className="mt-8 flex flex-wrap justify-end gap-3">{actions}</div>}
    </div>
  </div>
)

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.node,
}

export default Modal

