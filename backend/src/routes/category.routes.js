import express from 'express'
import { authorize, authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { categoryValidation, createCategory, listCategories, updateCategory } from '../controllers/category.controller.js'

const router = express.Router()

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Public - List all active categories
 *     responses:
 *       200:
 *         description: List of categories
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
 *                         $ref: '#/components/schemas/Category'
 */
router.get('/', listCategories)

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Admin - Create a category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', authenticate, authorize('admin'), validateRequest(categoryValidation.upsert), createCategory)

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Admin - Update a category
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.patch('/:id', authenticate, authorize('admin'), validateRequest(categoryValidation.upsert), updateCategory)

export default router


