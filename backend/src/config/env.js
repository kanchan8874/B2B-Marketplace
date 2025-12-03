import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/b2b_marketplace',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  // Increase access token lifetime so buyer/seller/admin sessions don't expire too quickly
  // Default: 5 days (can be overridden in .env with JWT_ACCESS_EXPIRES_IN)
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '5d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@b2b-marketplace.local',
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@123gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
}


