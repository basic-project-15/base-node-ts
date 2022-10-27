import mongoose from 'mongoose'

const schemaUsersAdmin = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  password: String,
  role: String,
})

const modelUsersAdmin = mongoose.model('usersAdmin', schemaUsersAdmin)

export default modelUsersAdmin
