import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createRFQ, getRFQ, listRFQs, respondToRFQ, rfqValidation } from '../controllers/rfq.controller.js'

const router = express.Router()

router.use(authenticate)

/**
 * @openapi
 * /rfqs:
 *   get:
 *     tags: [RFQs]
 *     summary: List RFQs for the current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending Response, Quoted, Accepted, Declined]
 *       - in: query
 *         name: roleView
 *         schema:
 *           type: string
 *           enum: [buyer, seller]
 *         description: View as buyer or seller where applicable
 *     responses:
 *       200:
 *         description: List of RFQs visible to the current user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RFQ'
 */
router.get('/', listRFQs)

/**
 * @openapi
 * /rfqs:
 *   post:
 *     tags: [RFQs]
 *     summary: Buyer - Create an RFQ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity, deliveryLocation]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               deliveryLocation:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: RFQ created
 */
router.post('/', authorize('buyer'), validateRequest(rfqValidation.create), createRFQ)

/**
 * @openapi
 * /rfqs/{id}:
 *   get:
 *     tags: [RFQs]
 *     summary: Get RFQ details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFQ details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RFQ'
 *       404:
 *         description: RFQ not found
 */
router.get('/:id', getRFQ)

/**
 * @openapi
 * /rfqs/{id}/respond:
 *   post:
 *     tags: [RFQs]
 *     summary: Seller - Respond to an RFQ
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
 *             required: [finalPrice, terms]
 *             properties:
 *               finalPrice:
 *                 type: number
 *               terms:
 *                 type: string
 *               deliveryTimeline:
 *                 type: string
 *     responses:
 *       200:
 *         description: RFQ response recorded
 */
router.post('/:id/respond', authorize('seller'), validateRequest(rfqValidation.respond), respondToRFQ)

export default router


