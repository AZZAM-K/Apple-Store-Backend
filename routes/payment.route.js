import express from 'express'
import { createCheckoutSession } from '../controllers/payment.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authenticate, createCheckoutSession)
router.post('/webhook', express.raw({ type: 'application/json' }))

export default router
