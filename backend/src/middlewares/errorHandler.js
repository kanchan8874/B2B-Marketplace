import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ApiError } from '../utils/ApiError.js'
import { failure } from '../utils/ApiResponse.js'
import { env } from '../config/env.js'

// 404 handler (registered separately)
export const notFoundHandler = (req, res) => {
  const statusCode = StatusCodes.NOT_FOUND
  return res.status(statusCode).json(
    failure('Route not found', statusCode, {
      path: req.originalUrl,
      method: req.method,
    }),
  )
}

// Global error handler
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  let message = getReasonPhrase(statusCode)
  let details

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    details = err.details
  } else if (err.name === 'ValidationError' && err.details) {
    statusCode = StatusCodes.BAD_REQUEST
    message = 'Validation failed'
    details = err.details
  } else if (err.name === 'MongoServerError') {
    statusCode = StatusCodes.BAD_REQUEST
    // Handle duplicate key errors (E11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field'
      message = `${field === 'slug' ? 'Category slug' : field} already exists. Please use a different ${field === 'slug' ? 'name' : field}.`
    } else {
      message = 'Database error'
    }
    if (env.NODE_ENV !== 'production') {
      details = { mongoError: err.message, code: err.code }
    }
  }

  if (env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  return res.status(statusCode).json(
    failure(message, statusCode, {
      ...details,
    }),
  )
}


