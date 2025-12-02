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

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Admin - List buyers and sellers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [buyer, seller]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', listUsers)

/**
 * @openapi
 * /admin/users/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Admin - Update user active / blocked status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/users/:id/status', validateRequest(adminValidation.updateUserStatus), updateUserStatus)

/**
 * @openapi
 * /admin/users/{id}/approval:
 *   patch:
 *     tags: [Admin]
 *     summary: Admin - Approve or reject a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [approvalStatus]
 *             properties:
 *               approvalStatus:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Approval updated
 */
router.patch('/users/:id/approval', validateRequest(adminValidation.updateUserApproval), updateUserApproval)

/**
 * @openapi
 * /admin/products/pending:
 *   get:
 *     tags: [Admin]
 *     summary: Admin - List products pending moderation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending products
 */
router.get('/products/pending', listPendingProducts)

/**
 * @openapi
 * /admin/products/{id}/moderate:
 *   patch:
 *     tags: [Admin]
 *     summary: Admin - Moderate a product (approve, reject, archive)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected, Archived]
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product moderation updated
 */
router.patch('/products/:id/moderate', validateRequest(adminValidation.moderateProduct), moderateProduct)

/**
 * @openapi
 * /admin/rfqs:
 *   get:
 *     tags: [Admin]
 *     summary: Admin - List RFQs across the marketplace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of RFQs for monitoring
 */
router.get('/rfqs', listRFQsForAdmin)

export default router


