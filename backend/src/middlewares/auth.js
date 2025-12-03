import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.js'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication token missing'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    // Special handling for static admin user (not stored in DB)
    if (payload.sub === 'admin' && payload.role === 'admin') {
      req.user = {
        id: 'admin',
        email: env.ADMIN_EMAIL,
        role: 'admin',
        name: 'Admin',
      }
      return next()
    }

    const user = await User.findById(payload.sub).select('-passwordHash')
    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'))
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    return next()
  } catch (error) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'))
  }
}

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to access this resource'))
    }
    return next()
  }


