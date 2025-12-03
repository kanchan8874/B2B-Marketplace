import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ['email', 'phone'], required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // Auto-delete after expiry
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Validation: Either email or phone must be provided
otpSchema.pre('validate', function (next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone must be provided'))
  } else {
    next()
  }
})

// Index for faster lookups
otpSchema.index({ email: 1, type: 1, verified: 1 })
otpSchema.index({ phone: 1, type: 1, verified: 1 })

export const OTP = mongoose.model('OTP', otpSchema)

