import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { getAdminDashboard, getBuyerDashboard, getSellerDashboard } from '../controllers/dashboard.controller.js'

const router = express.Router()

router.use(authenticate)

router.get('/buyer/summary', authorize('buyer'), getBuyerDashboard)
router.get('/seller/summary', authorize('seller'), getSellerDashboard)
router.get('/admin/summary', authorize('admin'), getAdminDashboard)

export default router


