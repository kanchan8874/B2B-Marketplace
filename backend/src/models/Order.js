import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', orderSchema)


