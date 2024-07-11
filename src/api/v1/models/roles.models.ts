import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  type: { type: String, required: true, maxLenght: 25 },
  description: { type: String, required: true, maxLenght: 50 },
  permissions: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      module: { type: String, required: true },
      action: { type: String, required: true },
    },
  ],
})

const model = mongoose.model('roles', schema)

export default model
