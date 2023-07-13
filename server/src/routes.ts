import { Application, NextFunction, Request, Response } from 'express'
import { admin, auth, user } from './route'
import createHttpError from 'http-errors'
export default function routes(app: Application) {
  app.use('/users', user)
  app.use('/auth', auth)
  app.use('/admins', admin)
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    throw createHttpError.NotFound('not found')
  })
}
