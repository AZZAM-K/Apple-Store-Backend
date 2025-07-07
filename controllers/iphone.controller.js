import iPhone from '../models/iphoneModel.js'
import asyncHandler from 'express-async-handler'
import { transformRating } from '../utils/rating.js'

const createIphone = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body
    const exitedIphone = await iPhone.findOne({ name })
    if (exitedIphone) {
      return res.status(400).json({ message: 'Iphone already exists' })
    }

    const createdIphone = new iPhone({ ...req.body })
    await createdIphone.save()
    return res.status(201).json(createdIphone)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getIphoneById = asyncHandler(async (req, res) => {
  try {
    const iphone = await iPhone.findById(req.params.id)
    if (!iphone) {
      return res.status(404).json({ message: 'Iphone not found' })
    }
    return res.status(200).json(iphone)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const deleteIphone = asyncHandler(async (req, res) => {
  const { id } = req.params.id
  try {
    const updatedIphone = iPhone.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    )
    if (!updatedIphone) {
      return res.status(404).json({ message: 'iPhone not found' })
    }
    return res.status(201).json(updatedIphone)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getAllIPhones = asyncHandler(async (req, res) => {
  try {
    const iPhones = await iPhone.find()
    if (!iPhones) {
      return res.status(404).json({ message: 'No iPhones found' })
    }
    return res.status(200).json(iPhones)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const addIPhoneReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body
    const iphone = await iPhone.findById(req.params.id)
    if (!iphone) {
      return res.status(404).json({ message: 'Iphone not found' })
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    iphone.reviews.push(review)
    iphone.numReviews = iphone.reviews.length
    iphone.rating = transformRating(iphone.reviews)
    await iphone.save()
    return res.status(201).json({ message: 'Review added' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const editIPhoneReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body
    const iphone = await iPhone.findById(req.params.id)
    if (!iphone) {
      return res.status(404).json({ message: 'Iphone not found' })
    }
    const iphoneReview = iphone.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    )
    if (!iphoneReview) {
      return res.status(404).json({ message: 'Review not found' })
    }
    iphoneReview.rating = Number(rating)
    iphoneReview.comment = comment
    iphone.rating = transformRating(iphone.reviews)
    await iphone.save()
    return res.status(201).json({ message: 'Review updated' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const deleteIPhoneReview = asyncHandler(async (req, res) => {
  try {
    const iphone = await iPhone.findById(req.params.id)
    if (!iphone) {
      return res.status(404).json({ message: 'Iphone not found' })
    }
    const iphoneReview = iphone.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    )
    if (!iphoneReview) {
      return res.status(404).json({ message: 'Review not found' })
    }
    iphone.reviews = iphone.reviews.filter(
      review => review.user.toString() !== req.user._id.toString()
    )
    iphone.numReviews = iphone.reviews.length
    iphone.rating = transformRating(iphone.reviews)
    await iphone.save()
    return res.status(201).json({ message: 'Review deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getLastIPhones = asyncHandler(async (req, res) => {
  const version = 16
  const keyword = `iPhone ${version}`
  try {
    const iPhones = await iPhone
      .find({ name: { $regex: keyword, $options: 'i' } })
      .sort({ createdAt: -1 })
    if (!iPhones || iPhones.length === 0) {
      return res.status(404).json({ message: 'No iPhones found' })
    }
    return res.status(200).json(iPhones)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

export {
  createIphone,
  getIphoneById,
  getAllIPhones,
  getLastIPhones,
  deleteIPhoneReview,
  editIPhoneReview,
  addIPhoneReview,
}
