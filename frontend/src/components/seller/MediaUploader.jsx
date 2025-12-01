import PropTypes from 'prop-types'
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

const MediaUploader = ({ onChange }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileNames, setFileNames] = useState([])

  const handleFiles = (files) => {
    const arr = Array.from(files || [])
    if (!arr.length) return
    setFileNames(arr.map((file) => file.name))
    onChange?.(arr)
  }

  const handleInputChange = (event) => {
    handleFiles(event.target.files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">Media upload</p>
          <p className="text-[11px] text-neutral-600">
            Drag and drop 3–5 clear product images, or click to browse from your device.
          </p>
        </div>
      </div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-4 py-5 text-center text-xs transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50/80'
            : 'border-blue-100 bg-white/80 hover:border-blue-300 hover:bg-blue-50/70'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="font-semibold text-blue-700">Click or drop files to upload</span>
        <span className="text-[11px] text-neutral-500">PNG, JPG up to 5MB each</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleInputChange} />
      </label>

      {fileNames.length > 0 && (
        <div className="rounded-xl border border-neutral-100 bg-white/80 p-2 text-[11px] text-neutral-600">
          <p className="mb-1 font-semibold text-neutral-800">Selected files</p>
          <ul className="space-y-0.5">
            {fileNames.map((name) => (
              <li key={name} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

MediaUploader.propTypes = {
  onChange: PropTypes.func,
}

export default MediaUploader


