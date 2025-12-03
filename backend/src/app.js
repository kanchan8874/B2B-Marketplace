import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import router from './routes/index.js'
import { notFoundHandler } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { swaggerSpec } from './docs/swagger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Disable ETag / HTTP caching for API responses to simplify client data handling
app.set('etag', false)

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

// Rate limiting (basic global) – disabled for now for local/dev
// If you want to re‑enable in future, set an appropriate max and remove the skip callback.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => true, // always skip → effectively no rate limit
})

app.use('/api', apiLimiter)

// Disable caching for API responses (always return fresh JSON)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// API routes
app.use('/api', router)

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 + error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app


