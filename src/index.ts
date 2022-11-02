import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@config/index'
import { authRoutes, permissionsRoutes, usersRoutes } from '@api/routes'
import { Paths } from '@common/types'

dotenv.config()

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(express.json())

app.use(express.text())

app.use('/', (req, _res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use('/api', authRoutes)
app.use(`/api/${Paths.users}`, usersRoutes)
app.use(`/api/${Paths.permissions}`, permissionsRoutes)

const bootstrap = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`)
  })
}

bootstrap()
