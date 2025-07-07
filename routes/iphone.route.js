import { Router } from 'express'
import { createIphone } from '../controllers/iphone.controller.js'
import { authenticate, authorizeAdmin } from '../middlewares/auth.js'
import {
  getIphoneById,
  getAllIPhones,
  addIPhoneReview,
  deleteIPhoneReview,
  editIPhoneReview,
  getLastIPhones,
} from '../controllers/iphone.controller.js'

const router = Router()

router.post('/', authenticate, authorizeAdmin, createIphone)
router.get('/', getAllIPhones)
router.get('/last', getLastIPhones)
router.get('/:id', getIphoneById)

router
  .route('/:id/reviews')
  .post(authenticate, addIPhoneReview)
  .put(authenticate, editIPhoneReview)
  .delete(authenticate, deleteIPhoneReview)

export default router
