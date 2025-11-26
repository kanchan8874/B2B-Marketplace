import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured')
  }

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
  })
}


