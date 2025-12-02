import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import { Upload, X, File } from 'lucide-react'
import Button from './Button.jsx'

const FileUpload = ({
  id,
  label,
  required,
  accept = '.pdf,.jpg,.jpeg,.png,.webp',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  multiple = false,
  value = [],
  onChange,
  error,
  helper,
  wrapperClassName = '',
}) => {
  const [files, setFiles] = useState(value || [])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const validFiles = []

    for (const file of newFiles) {
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`)
        continue
      }
      validFiles.push(file)
    }

    const updatedFiles = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, maxFiles)
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 tracking-tight">
        {label}
        {required && <span className="ml-1.5 text-status-danger" aria-label="required">*</span>}
      </label>

      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-brand-primary bg-brand-primary/5'
            : error
              ? 'border-status-danger bg-status-danger/5'
              : 'border-neutral-300 bg-neutral-50/50 hover:border-neutral-400 hover:bg-neutral-100/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-required={required}
          aria-invalid={Boolean(error)}
        />

        <div className="p-6 text-center">
          <Upload
            className={`mx-auto h-10 w-10 mb-3 ${
              dragActive ? 'text-brand-primary' : error ? 'text-status-danger' : 'text-neutral-400'
            }`}
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-neutral-700 mb-1">
            {dragActive ? 'Drop files here' : 'Click or drag files to upload'}
          </p>
          <p className="text-xs text-neutral-500 mb-4">
            {accept} (Max {maxSize / 1024 / 1024}MB per file{multiple ? `, up to ${maxFiles} files` : ''})
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={openFileDialog}
            className="rounded-full"
          >
            Choose Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
            >
              <File className="h-5 w-5 text-neutral-400 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                <p className="text-xs text-neutral-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex-shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {helper && !error && (
        <p className="text-xs text-neutral-500">{helper}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-status-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

FileUpload.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  multiple: PropTypes.bool,
  value: PropTypes.array,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helper: PropTypes.string,
  wrapperClassName: PropTypes.string,
}

export default FileUpload

