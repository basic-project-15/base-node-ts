import { connectDB, disconnectDB } from './config/db'
import { createRoles } from './collections/roles'
import { createUser } from './collections/users'

const run = async () => {
  try {
    await connectDB()
    await createRoles()
    await createUser()
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await disconnectDB()
  }
}

void run()
