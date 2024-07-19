import { Router } from 'express'
import type { Request, Response } from 'express'

const routes = Router()

/* APIs */
routes.get('/login', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Authentication',
    data: null,
  })
})
routes.get('/users', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Users',
    data: null,
  })
})

routes.get('/roles', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Roles',
    data: null,
  })
})

export default routes
