import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { getMe, profileValidation, updateMe } from '../controllers/profile.controller.js'

const router = express.Router()

router.use(authenticate)

/**
 * @openapi
 * /profile/me:
 *   get:
 *     tags: [Profile]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.get('/me', getMe)

/**
 * @openapi
 * /profile/me:
 *   patch:
 *     tags: [Profile]
 *     summary: Update the authenticated user's profile and notification preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               companyName:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *               notificationPreferences:
 *                 type: object
 *                 properties:
 *                   emailOnNewMessage:
 *                     type: boolean
 *                   emailOnKycStatus:
 *                     type: boolean
 *                   emailOnProductModeration:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/me', validateRequest(profileValidation.updateMe), updateMe)

export default router


