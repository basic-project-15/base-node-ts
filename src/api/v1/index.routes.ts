import swaggerUI from 'swagger-ui-express'
import { Router } from 'express'
import dotenv from 'dotenv'
import YAML from 'yamljs'
import { MIDDLEWARES, ROUTES } from '@api/v1'

dotenv.config()
const swaggerDocumentV1 = YAML.load('./src/api/v1/docs/security.yaml')
const serverName = process.env.SERVER_URL_NAME ?? ''
const routes = Router()

/* Middlewares */
routes.use('/', MIDDLEWARES.languages.dto)

/* Swagger */
routes.use(
  `/docs`,
  swaggerUI.serve,
  swaggerUI.setup(undefined, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: `${serverName}/api/v1/swagger/security.yaml`,
          name: 'Security',
        },
      ],
    },
  }),
)
routes.get('/swagger/security.yaml', (_req, res) => res.json(swaggerDocumentV1))

/* APIs */
routes.use('/', ROUTES.auth)
routes.use('/users', ROUTES.users)
routes.use('/roles', ROUTES.roles)

export default routes
