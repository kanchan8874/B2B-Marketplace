import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import router from './routes/index.js'
import { notFoundHandler } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { swaggerSpec } from './docs/swagger.js'

const app = express()

// Security & CORS
app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Rate limiting (basic global)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', apiLimiter)

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api', router)

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 + error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app


