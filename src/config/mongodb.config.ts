import mongoose from 'mongoose'
import { MONGODB_URL } from '@common'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    console.log('DB Connected')
  } catch (error) {
    console.log('DB not connected')
    console.log(error)
    process.exit(1)
  }
}
