import mongoose from 'mongoose'

const permissionsSchemas = new mongoose.Schema({
  path: { type: String, required: true, minLength: 2, maxLenght: 25 },
  method: { type: String, required: true, minLength: 3, maxLenght: 10 },
})

const permissionsModels = mongoose.model('permissions', permissionsSchemas)

export default permissionsModels
