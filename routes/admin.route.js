import { Router } from 'express'
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'
import { getAllOrders, deliverOrder } from '../controllers/order.controller.js'
import { authenticate, authorizeAdmin } from '../middlewares/auth.js'

const router = Router()

router.use(authenticate, authorizeAdmin)
router.get('/users', getAllUsers)
router.route('/users/:id').put(updateUser).delete(deleteUser)
router.get('/orders', getAllOrders)
router.put('/orders/:id/deliver', deliverOrder)

export default router
