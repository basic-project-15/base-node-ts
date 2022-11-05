import dotenv from 'dotenv'
dotenv.config()

export default {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: `${process.env.SERVER_URL_NAME}/api/v1/docs/swagger.yaml`,
        name: 'v1',
      },
    ],
  },
}
