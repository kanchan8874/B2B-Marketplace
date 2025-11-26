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
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)


