import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URL ?? ''

export const connectDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('DB Connected')
  } catch (error) {
    console.log('DB not connected')
    console.log(error)
    process.exit(1)
  }
}
