import { Router } from 'express'
import { usersControllers } from '@api/controllers'
import { usersDto } from '@middlewares/validations'
import { authorization, authToken } from '@middlewares/authentication'

const usersRoutes = Router()

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *    - Users
 *    summary: Get users List
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: Users list
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: the message of the response
 *                  example: "Users list"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbiden'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      409:
 *        $ref: '#/components/responses/Conflict'
 *      500:
 *        $ref: '#/components/responses/Error'
 */
usersRoutes.get('/', authToken, authorization, usersControllers.getUsers)
usersRoutes.get('/:idUser', authToken, authorization, usersControllers.getUser)
usersRoutes.post(
  '/',
  authToken,
  authorization,
  usersDto.createUser,
  usersControllers.createUser,
)
usersRoutes.patch(
  '/:idUser',
  authToken,
  authorization,
  usersDto.updateUser,
  usersControllers.updateUser,
)
usersRoutes.delete(
  '/:idUser',
  authToken,
  authorization,
  usersControllers.deleteUser,
)
usersRoutes.patch(
  '/:idUser/assignPermission',
  authToken,
  authorization,
  usersControllers.assignPermission,
)
usersRoutes.patch(
  '/:idUser/removePermission',
  authToken,
  authorization,
  usersControllers.removePermission,
)

export default usersRoutes
