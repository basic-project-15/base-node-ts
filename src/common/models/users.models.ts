import mongoose from 'mongoose'

const usersSchemas = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2, maxLenght: 100 },
  email: { type: String, required: true, maxLenght: 100 },
  password: { type: String, required: true },
  role: { type: String, required: true, maxLenght: 50 },
  permissions: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      path: { type: String, required: true },
      method: { type: String, required: true },
    },
  ],
})

const usersModels = mongoose.model('users', usersSchemas)

export default usersModels
