import express, { Application, ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { ZodError } from 'zod'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { initializePassport } from './middleware'
import 'dotenv'
import {} from './utils'
import createHttpError from 'http-errors'
const app: Application = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())

app.use(initializePassport())
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400)
    res.json({ err: err.issues, message: 'enter valid data' })
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token')
  } else if (err instanceof createHttpError.HttpError) {
    res.status(err.statusCode)
    res.json({
      status: err.statusCode,
      message: err.message,
    })
  } else {
    res.status(err?.statusCode ?? err?.code ?? 500)
    res.json({
      success: false,
      message: err.message ?? 'failed',
    })
  }
}
routes(app)
app.use(errorHandler)
export default app
