import User from '../models/userModel.js'
import { generateToken } from '../utils/jwt.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = new User({ name, email, password: hashedPassword })
  try {
    await user.save()
    const token = generateToken(user, res)
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid password' })
  }
  const token = generateToken(user, res)
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

const signOut = asyncHandler(async (req, res) => {
  res.clearCookie('jwt')
  return res.status(200).json({ message: 'Sign out successful' })
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  return res.status(200).json(user)
})

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (email) {
    const emailExists = await User.findOne({ email })
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Email already in use' })
    }
    user.email = email
  }
  if (name) {
    user.name = name
  }
  if (password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
  }
  try {
    await user.save()
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password')
  if (!users) {
    return res.status(404).json({ message: 'No users found' })
  }
  return res.status(200).json(users)
})

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

export {
  deleteUser,
  updateUser,
  getAllUsers,
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
}
