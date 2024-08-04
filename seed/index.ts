import { connectDB, disconnectDB } from './config/db'
import { createPermissions } from './collections/permissions'
import { createRoles } from './collections/roles'
import { createUser } from './collections/users'

const run = async () => {
  try {
    await connectDB()
    await createPermissions()
    await createRoles()
    await createUser()
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await disconnectDB()
  }
}

void run()
