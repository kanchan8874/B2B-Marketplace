import express from 'express'
import { authorize, authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { categoryValidation, createCategory, listCategories, updateCategory } from '../controllers/category.controller.js'

const router = express.Router()

router.get('/', listCategories)

router.post('/', authenticate, authorize('admin'), validateRequest(categoryValidation.upsert), createCategory)

router.patch('/:id', authenticate, authorize('admin'), validateRequest(categoryValidation.upsert), updateCategory)

export default router


