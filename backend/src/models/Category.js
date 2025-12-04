import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    icon: { type: String },
    image: { type: String }, // Category-specific image URL (uploaded by admin)
    slug: { type: String, unique: true, index: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Auto-generate slug from name if not provided
categorySchema.pre('save', async function (next) {
  if (!this.slug && this.name) {
    // Generate base slug from name: lowercase, replace spaces with hyphens, remove special chars
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

    // Check if slug already exists, append number if needed
    let slug = baseSlug
    let counter = 1
    const CategoryModel = this.constructor
    while (await CategoryModel.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    this.slug = slug
  }
  next()
})

export const Category = mongoose.model('Category', categorySchema)


