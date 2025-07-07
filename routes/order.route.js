import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  deleteOrder,
  payOrder,
} from '../controllers/order.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router()

router.post('/', authenticate, createOrder)
router.get('/my-orders', authenticate, getMyOrders)
router.get('/:id', authenticate, getOrderById)
router.delete('/:id', authenticate, deleteOrder)
router.put('/:id/pay', authenticate, payOrder)

export default router
