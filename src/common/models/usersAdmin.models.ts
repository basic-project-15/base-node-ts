import mongoose from 'mongoose'

const usersAdminSchemas = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
})

const usersAdminModels = mongoose.model('useradmins', usersAdminSchemas)

export default usersAdminModels
