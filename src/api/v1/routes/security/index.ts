import { Router } from 'express'
import roles from './roles.routes'
import users from './users.routes'

const routes = Router()

routes.use('/roles', roles)
routes.use('/users', users)

export default routes
