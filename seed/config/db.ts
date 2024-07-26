import mongoose from 'mongoose'
import { MONGODB_URL } from '@common'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (err) {
    console.error('Error disconnecting from MongoDB:', err)
  }
}
