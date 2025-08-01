import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log('Connection to database success')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

export default connectDB
