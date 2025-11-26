import mongoose from 'mongoose'

const rfqSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    deliveryLocation: {
      city: String,
      state: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['Pending Response', 'Quoted', 'Accepted', 'Declined'],
      default: 'Pending Response',
      index: true,
    },
    expiresAt: { type: Date },
    meta: {
      direction: String,
      side: String,
    },
  },
  { timestamps: true },
)

export const RFQ = mongoose.model('RFQ', rfqSchema)


