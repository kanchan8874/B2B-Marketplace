import { useEffect, useMemo, useState } from 'react'
import { Tag, Plus, Edit2, CheckCircle2, XCircle, Archive, UploadCloud } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { getCategories, createCategory, updateCategory } from '../../services/categoryService.js'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [formMode, setFormMode] = useState('create') // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
  })
  const [categoryImage, setCategoryImage] = useState(null) // File object for upload
  const [previewImage, setPreviewImage] = useState(null) // Preview URL

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setError(err.message || 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
    })
    setCategoryImage(null)
    setPreviewImage(null)
    setFormMode('create')
    setEditingId(null)
  }

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (cat) => {
    setFormMode('edit')
    setEditingId(cat._id)
    setForm({
      name: cat.name || '',
      description: cat.description || '',
    })
    setCategoryImage(null)
    setPreviewImage(cat.image || null) // Show existing image as preview
  }
  
  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setCategoryImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return

    try {
      setSaving(true)
      setError('')

      // Use FormData only if image is being uploaded, otherwise use JSON
      let payload
      let isFormData = false
      
      if (categoryImage) {
        // Create FormData if image is being uploaded
        const formData = new FormData()
        formData.append('name', form.name.trim())
        if (form.description.trim()) {
          formData.append('description', form.description.trim())
        }
        formData.append('image', categoryImage)
        payload = formData
        isFormData = true
      } else {
        // Use JSON if no image
        payload = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        }
        isFormData = false
      }

      if (formMode === 'create') {
        const created = await createCategory(payload, isFormData)
        setCategories((prev) => [created, ...prev])
      } else if (editingId) {
        const updated = await updateCategory(editingId, payload, isFormData)
        setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
      }

      resetForm()
    } catch (err) {
      console.error('Failed to save category:', err)
      setError(err.message || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (cat) => {
    try {
      // Send full payload so backend Joi validation (name required) passes
      const payload = {
        name: cat.name,
        description: cat.description || '',
        icon: cat.icon || '',
        image: cat.image || undefined,
        isActive: !cat.isActive,
      }

      const updated = await updateCategory(cat._id, payload)
      setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
    } catch (err) {
      console.error('Failed to update category status:', err)
      setError(err.message || 'Failed to update category status.')
    }
  }

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive !== false),
    [categories],
  )
  const archivedCategories = useMemo(
    () => categories.filter((c) => c.isActive === false),
    [categories],
  )

  return (
    <div className="space-y-8">
      {/* Top hero / summary */}
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 px-6 py-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.25)] sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
              Catalogue structure
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Category Management</h1>
            <p className="max-w-xl text-sm text-blue-50">
              Define clean, reusable buying categories so sellers can publish products in the right
              place and buyers can browse by business function.
            </p>
          </div>
          <div className="grid gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-6 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur">
              <span className="text-blue-100">Active categories</span>
              <span className="text-right text-lg font-semibold">
                {activeCategories.length.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 rounded-2xl bg-black/10 px-4 py-2.5 backdrop-blur">
              <span className="text-blue-100">Archived</span>
              <span className="text-right text-sm font-medium">
                {archivedCategories.length.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        {/* Left: create / edit form */}
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {formMode === 'create' ? 'Create category' : 'Edit category'}
              </h2>
              <p className="text-xs text-neutral-600">
                Group products by high-level business function or commodity cluster.
              </p>
            </div>
            {formMode === 'edit' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full text-xs"
                onClick={resetForm}
              >
                Cancel edit
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <FormField
              id="categoryName"
              label="Category name"
              required
              placeholder="e.g. Industrial Supplies"
              value={form.name}
              onChange={handleChange('name')}
            />
            <FormField
              id="categoryDescription"
              label="Short description"
              as="textarea"
              rows={3}
              placeholder="Optional — describe typical products (e.g. tools, PPE, MRO for factories)."
              value={form.description}
              onChange={handleChange('description')}
            />
            
            {/* Category Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900 tracking-tight">
                Category Image
                <span className="ml-1.5 text-xs font-normal text-neutral-500">(Optional)</span>
              </label>
              <div className="space-y-3">
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Category preview"
                      className="h-32 w-full rounded-xl object-cover border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null)
                        setCategoryImage(null)
                      }}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {!previewImage && (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-6 text-center transition-colors hover:border-blue-300 hover:bg-blue-50">
                    <UploadCloud className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Click to upload category image</span>
                    <span className="text-xs text-neutral-500">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full px-4 text-xs"
                onClick={resetForm}
              >
                Clear
              </Button>
              <Button
                type="submit"
                size="sm"
                className="inline-flex items-center gap-2 rounded-full px-5 text-xs"
                disabled={saving}
              >
                <Plus className="h-4 w-4" />
                {saving
                  ? 'Saving...'
                  : formMode === 'create'
                    ? 'Create category'
                    : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Right: list of categories */}
        <Card className="border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-emerald-50/70">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                <Tag className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Existing categories</h2>
                <p className="text-[11px] text-neutral-600">
                  Click edit to update labels or archive categories you no longer use.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-neutral-600">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-sm text-neutral-500">
              No categories yet. Use the form on the left to create your first category.
            </div>
          ) : (
            <div className="max-h-[460px] space-y-4 overflow-y-auto pr-1">
              <div className="space-y-2">
                {activeCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 text-sm"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {cat.image && (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-12 w-12 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {cat.icon && <span className="text-lg">{cat.icon}</span>}
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {cat.name}
                          </p>
                        </div>
                        {cat.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="rounded-full px-3 text-[11px]"
                        onClick={() => handleEdit(cat)}
                      >
                        <Edit2 className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="rounded-full px-3 text-[11px] text-amber-700 hover:bg-amber-50"
                        onClick={() => handleToggleActive(cat)}
                      >
                        <Archive className="mr-1 h-3 w-3" />
                        Archive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {archivedCategories.length > 0 && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Archived
                  </p>
                  <div className="space-y-2">
                    {archivedCategories.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-800">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                              {cat.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-1 text-[10px] font-semibold text-neutral-700">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="rounded-full px-3 text-[11px] text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleToggleActive(cat)}
                          >
                            Reactivate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default CategoryManagement


