import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    icon: { type: String },
    slug: { type: String, unique: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Category = mongoose.model('Category', categorySchema)


