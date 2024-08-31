import request from 'supertest'
import { app } from '../src/app'
import { SERVER_PORT, SERVER_URL_NAME } from '@common'
import { mongodb } from '@config'
let server: any

beforeAll(done => {
  server = app.listen(SERVER_PORT, async () => {
    await mongodb.connectDB()
    console.log(`Server running on ${SERVER_URL_NAME}`)
  })
  done()
})

afterAll(done => {
  server.close(done)
})

describe('Auth API', () => {
  test('should respond with a 401 status code', async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'Test_1234',
    }
    const response = await request(server)
      .post('/api/v1/auth/login/email-and-pass')
      .send(loginData)
    expect(response.status).toBe(401)
  })
})
