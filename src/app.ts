import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { acceptLanguages } from '@middlewares'
import { routes } from '@api'

export const app = express()

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
app.use('/api', acceptLanguages, routes)
