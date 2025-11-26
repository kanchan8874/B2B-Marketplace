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

router.get('/', listProducts)
router.get('/:id', getProduct)

router.post(
  '/',
  authenticate,
  authorize('seller'),
  upload.single('image'),
  validateRequest(productValidation.upsert),
  createProduct,
)

router.patch(
  '/:id',
  authenticate,
  authorize('seller', 'admin'),
  upload.single('image'),
  validateRequest(productValidation.upsert),
  updateProduct,
)

export default router


