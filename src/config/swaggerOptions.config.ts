import dotenv from 'dotenv'
dotenv.config()

export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Base-Node-TS API',
      version: '1.0.0',
      description: 'Documentation of the NodeJS base project with TypeScript.',
    },
    servers: [
      {
        url: `${process.env.SERVER_URL_NAME}/api`,
      },
    ],
  },
  apis: ['./src/api/docs/*.ts'],
}
