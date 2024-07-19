import swaggerUI from 'swagger-ui-express'
import { Router } from 'express'
import dotenv from 'dotenv'
import YAML from 'yamljs'
import {
  AuthenticationMiddleware,
  AuthorizationMiddleware,
  LanguagesMiddleware,
} from '@api/v1'
import auth from './auth.routes'
import security from './security'

dotenv.config()

const swaggerDocumentV1 = YAML.load('./src/api/v1/docs/security.yaml')
const serverName = process.env.SERVER_URL_NAME ?? ''
const routes = Router()

/* Middlewares */
routes.use('/', LanguagesMiddleware)

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
routes.use('/auth', auth)
routes.use(
  '/security',
  AuthenticationMiddleware,
  AuthorizationMiddleware,
  security,
)

export default routes
