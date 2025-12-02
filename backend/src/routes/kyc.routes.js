import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { uploadMultiple } from '../middlewares/upload.js'
import {
  // Seller KYC
  submitSellerKYC,
  getSellerKYC,
  getPendingSellerKYCs,
  approveSellerKYC,
  rejectSellerKYC,
  sellerKYCValidation,
  // Buyer KYC
  submitBuyerKYC,
  getBuyerKYC,
  getPendingBuyerKYCs,
  approveBuyerKYC,
  rejectBuyerKYC,
  buyerKYCValidation,
} from '../controllers/kyc.controller.js'

const router = express.Router()

// ========== SELLER KYC ROUTES ==========

/**
 * @openapi
 * /kyc/seller/submit:
 *   post:
 *     tags: [KYC]
 *     summary: Submit seller KYC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [businessName, businessAddress, city, state, contactPerson, phone, email, yearsInBusiness, businessType]
 *             properties:
 *               businessName:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               yearsInBusiness:
 *                 type: number
 *               businessType:
 *                 type: string
 *                 enum: [manufacturer, trader, both]
 *               certificateOfIncorporation:
 *                 type: string
 *                 format: binary
 *               gstCertificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 */
router.post(
  '/seller/submit',
  authenticate,
  uploadMultiple.fields([
    { name: 'certificateOfIncorporation', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'otherDocuments', maxCount: 5 },
  ]),
  validateRequest(sellerKYCValidation.submit),
  submitSellerKYC,
)

/**
 * @openapi
 * /kyc/seller:
 *   get:
 *     tags: [KYC]
 *     summary: Get seller KYC status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status
 */
router.get('/seller', authenticate, getSellerKYC)

/**
 * @openapi
 * /kyc/seller/pending:
 *   get:
 *     tags: [KYC]
 *     summary: Admin - Get pending seller KYCs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected, All]
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of pending KYCs
 */
router.get('/seller/pending', authenticate, getPendingSellerKYCs)

/**
 * @openapi
 * /kyc/seller/:kycId/approve:
 *   post:
 *     tags: [KYC]
 *     summary: Admin - Approve seller KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved
 */
router.post(
  '/seller/:kycId/approve',
  authenticate,
  validateRequest(sellerKYCValidation.approve),
  approveSellerKYC,
)

/**
 * @openapi
 * /kyc/seller/:kycId/reject:
 *   post:
 *     tags: [KYC]
 *     summary: Admin - Reject seller KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rejectionReason]
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC rejected
 */
router.post(
  '/seller/:kycId/reject',
  authenticate,
  validateRequest(sellerKYCValidation.reject),
  rejectSellerKYC,
)

// ========== BUYER KYC ROUTES ==========

/**
 * @openapi
 * /kyc/buyer/submit:
 *   post:
 *     tags: [KYC]
 *     summary: Submit buyer KYC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [businessName, contactPerson, email, phone]
 *             properties:
 *               businessName:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               businessRegistration:
 *                 type: string
 *                 format: binary
 *               gstCertificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 */
router.post(
  '/buyer/submit',
  authenticate,
  uploadMultiple.fields([
    { name: 'businessRegistration', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'otherDocuments', maxCount: 5 },
  ]),
  validateRequest(buyerKYCValidation.submit),
  submitBuyerKYC,
)

/**
 * @openapi
 * /kyc/buyer:
 *   get:
 *     tags: [KYC]
 *     summary: Get buyer KYC status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status
 */
router.get('/buyer', authenticate, getBuyerKYC)

/**
 * @openapi
 * /kyc/buyer/pending:
 *   get:
 *     tags: [KYC]
 *     summary: Admin - Get pending buyer KYCs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected, All]
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of pending KYCs
 */
router.get('/buyer/pending', authenticate, getPendingBuyerKYCs)

/**
 * @openapi
 * /kyc/buyer/:kycId/approve:
 *   post:
 *     tags: [KYC]
 *     summary: Admin - Approve buyer KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved
 */
router.post(
  '/buyer/:kycId/approve',
  authenticate,
  validateRequest(buyerKYCValidation.approve),
  approveBuyerKYC,
)

/**
 * @openapi
 * /kyc/buyer/:kycId/reject:
 *   post:
 *     tags: [KYC]
 *     summary: Admin - Reject buyer KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rejectionReason]
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC rejected
 */
router.post(
  '/buyer/:kycId/reject',
  authenticate,
  validateRequest(buyerKYCValidation.reject),
  rejectBuyerKYC,
)

export default router

