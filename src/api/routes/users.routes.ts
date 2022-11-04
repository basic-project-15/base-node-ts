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
 *                  description: The message of the response
 *                  example: "Users list"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      409:
 *        $ref: '#/components/responses/Conflict'
 *      500:
 *        $ref: '#/components/responses/Error'
 */
usersRoutes.get('/', authToken, authorization, usersControllers.getUsers)

/**
 * @swagger
 * /users/{idUser}:
 *  get:
 *    tags:
 *    - Users
 *    summary: Get user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: idUser
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: The message of the response
 *                  example: "User information"
 *                data:
 *                  $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbiden'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/Error'
 */
usersRoutes.get('/:idUser', authToken, authorization, usersControllers.getUser)

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *    - Users
 *    summary: Create a user
 *    security:
 *    - bearerAuth: []
 *    requestBody:
 *      description: The user to create.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Luis Fernando
 *              email:
 *                type: string
 *                example: luis@gmail.com
 *              password:
 *                type: string
 *                example: "****"
 *              role:
 *                type: string
 *                example: super-admin
 *            required:
 *              - name
 *              - email
 *              - password
 *              - role
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: The message of the response
 *                  example: "User information"
 *                data:
 *                  type: object
 *                  description: User created
 *                  example:
 *                    id: 6361d7b7e1c6aa506aa064c1
 *                    name: Luis Fernando
 *                    email: luis@gmail.com
 *                    role: super-admin
 *                    permissions: []
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbiden'
 *      409:
 *        $ref: '#/components/responses/Conflict'
 *      500:
 *        $ref: '#/components/responses/Error'
 */
usersRoutes.post(
  '/',
  authToken,
  authorization,
  usersDto.createUser,
  usersControllers.createUser,
)

/**
 * @swagger
 * /users/{idUser}:
 *  patch:
 *    tags:
 *    - Users
 *    summary: Update a user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: idUser
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    requestBody:
 *      description: The user to create.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Luis Fernando
 *              email:
 *                type: string
 *                example: luis@gmail.com
 *              password:
 *                type: string
 *                example: "****"
 *              role:
 *                type: string
 *                example: super-admin
 *            required:
 *              - name
 *              - email
 *              - password
 *              - role
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: The message of the response
 *                  example: "User information"
 *                data:
 *                  type: object
 *                  description: User created
 *                  example:
 *                    id: 6361d7b7e1c6aa506aa064c1
 *                    name: Luis Fernando Solano
 *                    email: luisfer@gmail.com
 *                    role: admin
 *                    permissions: []
 *      400:
 *        $ref: '#/components/responses/BadRequest'
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
usersRoutes.patch(
  '/:idUser',
  authToken,
  authorization,
  usersDto.updateUser,
  usersControllers.updateUser,
)

/**
 * @swagger
 * /users/{idUser}:
 *  delete:
 *    tags:
 *    - Users
 *    summary: Delete user
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: idUser
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: The message of the response
 *                  example: "User information"
 *                data:
 *                  $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbiden'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/Error'
 */
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
