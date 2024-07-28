import { Router } from 'express'
import permissions from './permissions.routes'
import roles from './roles.routes'
import users from './users.routes'

const routes = Router()

routes.use('/permissions', permissions)
routes.use('/roles', roles)
routes.use('/users', users)

export default routes
