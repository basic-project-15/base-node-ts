import express from 'express'
import dotenv from 'dotenv'
import { helloWorld } from '@core/helpers'
import { connectDB } from '@config/index'
import { usersAdminRoutes } from '@api/routes'

dotenv.config()

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(express.json())

app.use(express.text())

app.use('/', (req, _res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use('/api/usersAdmin', usersAdminRoutes)

app.get('/helloworld', (_req, res) => {
  const message = helloWorld()
  console.log(message)
  res.send(message)
})

const bootstrap = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`)
  })
}

bootstrap()
