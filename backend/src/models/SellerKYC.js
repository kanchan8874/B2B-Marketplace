import mongoose from 'mongoose'

const sellerKYCSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    yearsInBusiness: {
      type: Number,
      required: true,
      min: 0,
    },
    businessType: {
      type: String,
      enum: ['manufacturer', 'trader', 'both'],
      required: true,
    },
    documents: {
      certificateOfIncorporation: {
        type: String, // File path/URL
        required: true,
      },
      gstCertificate: {
        type: String, // File path/URL (optional)
      },
      otherDocuments: [
        {
          type: String, // File path/URL
        },
      ],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Index for efficient queries
sellerKYCSchema.index({ status: 1, createdAt: -1 })

export const SellerKYC = mongoose.model('SellerKYC', sellerKYCSchema)

