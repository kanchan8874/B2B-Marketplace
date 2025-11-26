import mongoose from 'mongoose'

const rfqResponseSchema = new mongoose.Schema(
  {
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    finalPrice: { type: Number, required: true },
    terms: { type: String }, // delivery time / payment terms as plain text
  },
  { timestamps: true },
)

export const RFQResponse = mongoose.model('RFQResponse', rfqResponseSchema)


