import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import { verifyToken } from '../utils/jwt.js'

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      const user = await User.findById(decoded.id).select('-password')
      if (user) {
        req.user = user
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  } else {
    res.status(401).json({ message: 'No token provided' })
  }
})

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: 'Access denied' })
  }
})

export { authenticate, authorizeAdmin }
