import PropTypes from 'prop-types'
import { UploadCloud } from 'lucide-react'

const MediaUploader = ({ onChange }) => {
  const handleFiles = (event) => {
    const files = Array.from(event.target.files || [])
    onChange?.(files)
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/60 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">Media upload</p>
          <p className="text-xs text-neutral-600">
            Drag and drop product images here, or click to browse. 3–5 high quality visuals work best.
          </p>
        </div>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-4 py-6 text-center text-xs text-neutral-500 hover:border-blue-300 hover:bg-blue-50/70">
        <span className="font-semibold text-blue-700">Click to upload</span>
        <span className="text-[11px] text-neutral-500">PNG, JPG up to 5MB each</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </label>
    </div>
  )
}

MediaUploader.propTypes = {
  onChange: PropTypes.func,
}

export default MediaUploader


