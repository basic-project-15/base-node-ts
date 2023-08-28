import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB } from '@config'
import v1Routes from '@api/v1'
import v2Routes from '@api/v2'

dotenv.config()
const PORT = process.env.PORT ?? 3000
const SERVER_URL_NAME = process.env.SERVER_URL_NAME ?? ''
const app = express()

// Middlewares
app.use(express.json())
app.use(express.text())
app.use(cors())
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

// API
app.get('/', (_req, res) => {
  const html = `
    <h1>Swagger api documentation</h1>
    <h2><a href="${SERVER_URL_NAME}/api/v1/docs">API v1</a></h2>
    <h2><a href="${SERVER_URL_NAME}/api/v2/docs">API v2</a></h2>
  `
  return res.status(200).send(html)
})
app.use('/api/v1', v1Routes)
app.use('/api/v2', v2Routes)

const bootstrap = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on ${SERVER_URL_NAME}`)
  })
}

bootstrap()
