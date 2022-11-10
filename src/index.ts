import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import { connectDB, swaggerOptions } from '@config'
import { Paths } from '@common/types'
import { authRoutes, permissionsRoutes, usersRoutes } from '@api/v1/routes'
import { languages } from '@middlewares/validations'

dotenv.config()
const PORT = process.env.PORT ?? 3000
const SERVER_URL_NAME = process.env.SERVER_URL_NAME ?? ''
const app = express()
const swaggerDocumentV1 = YAML.load('./src/api/v1/docs/swagger.yaml')

// Middlewares
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
app.use('/', languages)

// API
app.use(
  `/api-docs`,
  swaggerUI.serve,
  swaggerUI.setup(undefined, swaggerOptions),
)
app.get('/api/v1/docs/swagger.yaml', (_req, res) => res.json(swaggerDocumentV1))
app.use('/api/v1', authRoutes)
app.use(`/api/v1/${Paths.users}`, usersRoutes)
app.use(`/api/v1/${Paths.permissions}`, permissionsRoutes)

const bootstrap = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on ${SERVER_URL_NAME}`)
  })
}

bootstrap()
