import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { getMe, profileValidation, updateMe } from '../controllers/profile.controller.js'

const router = express.Router()

router.use(authenticate)

router.get('/me', getMe)
router.patch('/me', validateRequest(profileValidation.updateMe), updateMe)

export default router


