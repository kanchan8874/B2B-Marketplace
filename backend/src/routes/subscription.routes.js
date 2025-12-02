import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import Joi from 'joi'
import { getSellerSubscription, updateSellerSubscription } from '../controllers/subscription.controller.js'

const router = express.Router()

const subscriptionValidation = {
  update: Joi.object({
    body: Joi.object({
      tier: Joi.string().valid('Silver', 'Gold', 'Platinum').required(),
    }).required(),
    params: Joi.object({
      sellerId: Joi.string().required(),
    }).required(),
  }),
}

/**
 * @openapi
 * /subscription/seller:
 *   get:
 *     tags: [Subscription]
 *     summary: Get seller subscription info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription info with tier, limits, and remaining slots
 */
router.get('/seller', authenticate, getSellerSubscription)

/**
 * @openapi
 * /subscription/seller/:sellerId:
 *   patch:
 *     tags: [Subscription]
 *     summary: Admin - Update seller subscription tier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tier]
 *             properties:
 *               tier:
 *                 type: string
 *                 enum: [Silver, Gold, Platinum]
 *     responses:
 *       200:
 *         description: Subscription tier updated
 */
router.patch(
  '/seller/:sellerId',
  authenticate,
  validateRequest(subscriptionValidation.update),
  updateSellerSubscription,
)

export default router

