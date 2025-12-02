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
      enum: ['Draft', 'Pending', 'Live', 'To Be Offered'],
      default: 'Pending',
      index: true,
    },
    priceValidityDate: {
      type: Date,
      index: true,
    },
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Advance', 'COD', 'Other'],
    },
    shipmentMode: {
      type: String,
      enum: ['Road', 'Rail', 'Air', 'Sea', 'Express', 'Other'],
    },
    tags: [{ type: String }],
    images: [{ type: String }],
    city: String,
    state: String,
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', productSchema)


