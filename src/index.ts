import { SERVER_PORT, SERVER_URL_NAME } from '@common'
import { mongodb } from '@config'
import { app } from './app'

app.listen(SERVER_PORT, async () => {
  await mongodb.connectDB()
  console.log(`Server running on ${SERVER_URL_NAME}`)
})
