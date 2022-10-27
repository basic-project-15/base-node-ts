import mongoose from 'mongoose'

const usersAdminSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  password: String,
  role: String,
})

const usersAdminModel = mongoose.model('usersAdmin', usersAdminSchema)

export default usersAdminModel
