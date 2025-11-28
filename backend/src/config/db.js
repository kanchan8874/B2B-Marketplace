import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured')
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
    })

    // eslint-disable-next-line no-console
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection error:', error.message)
    throw error
  }
}


