import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { getAdminDashboard, getBuyerDashboard, getSellerDashboard } from '../controllers/dashboard.controller.js'

const router = express.Router()

router.use(authenticate)

/**
 * @openapi
 * /dashboard/buyer/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Buyer - Get dashboard KPI summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyer dashboard KPIs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/KPIBuyerSummary'
 */
router.get('/buyer/summary', authorize('buyer'), getBuyerDashboard)

/**
 * @openapi
 * /dashboard/seller/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Seller - Get dashboard KPI summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller dashboard KPIs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/KPISellerSummary'
 */
router.get('/seller/summary', authorize('seller'), getSellerDashboard)

/**
 * @openapi
 * /dashboard/admin/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Admin - Get dashboard KPI summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard KPIs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/KPIAdminSummary'
 */
router.get('/admin/summary', authorize('admin'), getAdminDashboard)

export default router


