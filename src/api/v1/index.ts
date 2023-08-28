import swaggerUI from 'swagger-ui-express'
import { Router } from 'express'
import { authRoutes, rolesRoutes, usersRoutes } from './routes'
import dotenv from 'dotenv'
import YAML from 'yamljs'
import { languagesDto } from '@api/v1/middlewares'

dotenv.config()
const v1Routes = Router()
const swaggerDocumentV1 = YAML.load('./src/api/v1/docs/security.yaml')

/* Middlewares */
v1Routes.use('/', languagesDto)

/* Swagger */
v1Routes.use(
  `/docs`,
  swaggerUI.serve,
  swaggerUI.setup(undefined, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: `${process.env.SERVER_URL_NAME}/api/v1/swagger/security.yaml`,
          name: 'Security',
        },
      ],
    },
  }),
)
v1Routes.get('/swagger/security.yaml', (_req, res) =>
  res.json(swaggerDocumentV1),
)

/* APIs */
v1Routes.use('/', authRoutes)
v1Routes.use('/users', usersRoutes)
v1Routes.use('/roles', rolesRoutes)

export default v1Routes
