import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/b2b_marketplace',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
}


