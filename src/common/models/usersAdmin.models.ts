import mongoose from 'mongoose'

const usersAdminSchemas = new mongoose.Schema({
  name: { type: String, require: true, minLength: 2, maxLenght: 100 },
  email: { type: String, require: true, maxLenght: 100 },
  password: { type: String, require: true },
  role: { type: String, require: true, maxLenght: 50 },
  permissions: [
    {
      id: String,
      path: String,
      method: String,
    },
  ],
})

const usersAdminModels = mongoose.model('useradmins', usersAdminSchemas)

export default usersAdminModels
