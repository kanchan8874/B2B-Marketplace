import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createRFQ, getRFQ, listRFQs, respondToRFQ, rfqValidation } from '../controllers/rfq.controller.js'

const router = express.Router()

router.use(authenticate)

router.get('/', listRFQs)
router.post('/', authorize('buyer'), validateRequest(rfqValidation.create), createRFQ)
router.get('/:id', getRFQ)
router.post('/:id/respond', authorize('seller'), validateRequest(rfqValidation.respond), respondToRFQ)

export default router


