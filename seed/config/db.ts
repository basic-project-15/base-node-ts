import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URL ?? ''

export const connectDB = async () => {
  try {
    await mongoose.connect(url)
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
