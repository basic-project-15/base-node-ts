import mongoose from 'mongoose'

const schemaUsersAdmin = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const modelUsersAdmin = mongoose.model('useradmins', schemaUsersAdmin)

export default modelUsersAdmin
