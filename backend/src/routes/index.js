import express from 'express'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import categoryRoutes from './category.routes.js'
import rfqRoutes from './rfq.routes.js'
import profileRoutes from './profile.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import adminRoutes from './admin.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/rfqs', rfqRoutes)
router.use('/profile', profileRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/admin', adminRoutes)

export default router


