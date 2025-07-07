import { Router } from 'express'
import {
  signIn,
  signOut,
  signUp,
  getProfile,
  updateProfile,
  getAllUsers,
} from '../controllers/user.controller.js'
import { authenticate, authorizeAdmin } from '../middlewares/auth.js'

const router = Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/sign-out', authenticate, signOut)
router
  .route('/profile')
  .get(authenticate, getProfile)
  .put(authenticate, updateProfile)

export default router
