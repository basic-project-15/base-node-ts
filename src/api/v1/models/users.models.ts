import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLenght: 100 },
  lastName: { type: String, required: true, maxLenght: 100 },
  email: { type: String, required: true, maxLenght: 50 },
  phoneNumber: { type: String, required: true, maxLenght: 30 },
  password: { type: String, required: true, maxLenght: 100 },
  photo: { type: String, required: true, maxLenght: 255 },
  created_at: { type: Date, required: true, maxLenght: 50 },
  created_by: { type: mongoose.Schema.Types.ObjectId },
  updated_at: { type: Date, required: true, maxLenght: 50 },
  updated_by: { type: mongoose.Schema.Types.ObjectId },
  idRole: { type: mongoose.Schema.Types.ObjectId },
})

const model = mongoose.model('users', schema)

export default model
