import { Request, Response, Router } from 'express'

const v2Routes = Router()

/* APIs */
v2Routes.use('/login', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Authentication',
    data: null,
  })
})

v2Routes.use('/users', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Users',
    data: null,
  })
})

v2Routes.use('/roles', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Roles',
    data: null,
  })
})

export default v2Routes
