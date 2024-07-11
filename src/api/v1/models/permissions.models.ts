import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  module: { type: String, required: true, minLength: 2, maxLenght: 25 },
  action: { type: String, required: true, minLength: 3, maxLenght: 10 },
})

const model = mongoose.model('permissions', schema)

export default model
