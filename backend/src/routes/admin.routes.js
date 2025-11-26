import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  adminValidation,
  listPendingProducts,
  listRFQsForAdmin,
  listUsers,
  moderateProduct,
  updateUserStatus,
  updateUserApproval,
} from '../controllers/admin.controller.js'

const router = express.Router()

router.use(authenticate, authorize('admin'))

router.get('/users', listUsers)
router.patch('/users/:id/status', validateRequest(adminValidation.updateUserStatus), updateUserStatus)
router.patch('/users/:id/approval', validateRequest(adminValidation.updateUserApproval), updateUserApproval)

router.get('/products/pending', listPendingProducts)
router.patch('/products/:id/moderate', validateRequest(adminValidation.moderateProduct), moderateProduct)

router.get('/rfqs', listRFQsForAdmin)

export default router


