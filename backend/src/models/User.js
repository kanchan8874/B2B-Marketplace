import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      required: true,
      index: true,
    },
    companyName: { type: String },
    gstNumber: { type: String },
    address: { type: String },
    location: {
      city: String,
      state: String,
      country: String,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false, index: true }, // For verified badge
    subscriptionTier: {
      type: String,
      enum: ['Silver', 'Gold', 'Platinum'],
      default: 'Silver',
    },
    notificationPreferences: {
      emailOnNewMessage: { type: Boolean, default: true },
      emailOnKycStatus: { type: Boolean, default: true },
      emailOnProductModeration: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)


