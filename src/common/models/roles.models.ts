import mongoose from 'mongoose'

const rolesSchemas = new mongoose.Schema({
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

const rolesModels = mongoose.model('roles', rolesSchemas)

export default rolesModels
