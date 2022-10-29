import mongoose from 'mongoose'

const usersAdminSchemas = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const usersAdminModels = mongoose.model('useradmins', usersAdminSchemas)

export default usersAdminModels
