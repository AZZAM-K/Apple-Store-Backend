import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import adminRouter from './routes/admin.route.js'
import iphoneRouter from './routes/iphone.route.js'
import orderRouter from './routes/order.route.js'
import uploadRouter from './routes/upload.route.js'
import paymentRouter from './routes/payment.route.js'
import cors from 'cors'
import path from 'path'

dotenv.config()
const port = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use('/api/upload', uploadRouter)
app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/iphone', iphoneRouter)
app.use('/api/orders', orderRouter)
app.use('/api/payment', paymentRouter)

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
  await connectDB()
})
