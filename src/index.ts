import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import { connectDB, swaggerOptions } from '@config'
import { authRoutes, permissionsRoutes, usersRoutes } from '@api/routes'
import { Paths } from '@common/types'

dotenv.config()

const PORT = process.env.PORT ?? 3000
const SERVER_URL_NAME = process.env.SERVER_URL_NAME ?? ''
const app = express()
const specs = swaggerJsDoc(swaggerOptions)

app.use(express.json())

app.use(express.text())

app.use(
  '/',
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ')
  }),
)

app.use('/api', authRoutes)
app.use(`/api/${Paths.users}`, usersRoutes)
app.use(`/api/${Paths.permissions}`, permissionsRoutes)
app.use(`/api/docs`, swaggerUI.serve, swaggerUI.setup(specs))

const bootstrap = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on ${SERVER_URL_NAME}`)
  })
}

bootstrap()
