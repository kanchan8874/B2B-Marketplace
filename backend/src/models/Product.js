import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priceMin: { type: Number, required: true },
    priceMax: { type: Number, required: true },
    moq: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Live'],
      default: 'Pending',
      index: true,
    },
    tags: [{ type: String }],
    images: [{ type: String }],
    city: String,
    state: String,
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', productSchema)


