import { Request, Response, NextFunction } from 'express'

const authBasic = (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.headers)
  return next()
}

export default authBasic
