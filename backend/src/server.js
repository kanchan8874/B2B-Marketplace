import { createServer } from 'http'
import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

const start = async () => {
  try {
    await connectDB()

    const server = createServer(app)
    const port = env.PORT

    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API server running on port ${port} (${env.NODE_ENV})`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

start()


