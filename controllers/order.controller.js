import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, totalPrice, customerName, customerEmail } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' })
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      customerName,
      customerEmail,
      quantity: orderItems.reduce((acc, item) => acc + item.quantity, 0),
    })

    const savedOrder = await order.save()
    return res
      .status(201)
      .json({ message: 'Order created successfully', order: savedOrder })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this order' })
    }
    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this order' })
    }
    if (order.isPaid) {
      return res.status(400).json({ message: 'Cannot cancel a paid order' })
    }
    await order.deleteOne()
    return res.status(200).json({ message: 'Order cancelled successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const payOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to pay for this order' })
    }
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order already paid' })
    }
    order.isPaid = true
    order.paidAt = new Date()
    await order.save()
    return res.status(200).json({ message: 'Order paid successfully', order })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const deliverOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order not paid' })
    }
    if (order.isDelivered) {
      return res.status(400).json({ message: 'Order already delivered' })
    }
    order.isDelivered = true
    order.deliveredAt = new Date()
    await order.save()
    return res
      .status(200)
      .json({ message: 'Order delivered successfully', order })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  deleteOrder,
  payOrder,
  deliverOrder,
}
