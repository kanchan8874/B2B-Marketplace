import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { upload } from '../middlewares/upload.js'
import {
  createProduct,
  getProduct,
  listProducts,
  productValidation,
  updateProduct,
} from '../controllers/product.controller.js'

const router = express.Router()

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Public - List products with optional filters
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Free text search on name / description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Pending, Live]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
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
 *                         $ref: '#/components/schemas/Product'
 */
router.get('/', listProducts)

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Public - Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProduct)

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Seller - Create a product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category, priceMin, priceMax, moq]
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priceMin:
 *                 type: number
 *               priceMax:
 *                 type: number
 *               moq:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Draft, Pending, Live]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error or subscription limit reached
 */
router.post(
  '/',
  authenticate,
  authorize('seller'),
  upload.single('image'),
  validateRequest(productValidation.upsert),
  createProduct,
)

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Seller/Admin - Update a product
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priceMin:
 *                 type: number
 *               priceMax:
 *                 type: number
 *               moq:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Draft, Pending, Live]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch(
  '/:id',
  authenticate,
  authorize('seller', 'admin'),
  upload.single('image'),
  validateRequest(productValidation.upsert),
  updateProduct,
)

export default router


