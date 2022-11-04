/**
 * @swagger
 * tags:
 * - name: Users
 *   description: Endpoints for user management
 * - name: Permissions
 *   description: Endpoints for permissions management
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      bearerFormat: JWT
 *      scheme: bearer
 *  responses:
 *    BadRequest:
 *      description: Bad Request
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "Invalid data format"
 *              data:
 *                type: "object"
 *                description: More information about the problem
 *    Unauthorized:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "Invalid token"
 *              data:
 *                type: "null"
 *    Forbiden:
 *      description: Forbiden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "You do not have permissions"
 *              data:
 *                type: "null"
 *    NotFound:
 *      description: "Not Found"
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "Resource not found"
 *              data:
 *                type: "null"
 *    Conflict:
 *      description: Conflict
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "Parameter conflict"
 *              data:
 *                type: "null"
 *    Error:
 *      description: "Error: Internal Server Error"
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                description: The message of the response
 *                example: "Internal server problem"
 *              data:
 *                type: "null"
 *  schemas:
 *    Permission:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: the id permission
 *          example: 63617387baa1db43744d588c
 *        path:
 *          type: string
 *          description: the path permission
 *          example: users
 *        method:
 *          type: string
 *          description: the method permission
 *          example: GET
 *      required:
 *        - id
 *        - path
 *        - method
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: the id user
 *          example: 6361d7b7e1c6aa506aa064c1
 *        name:
 *          type: string
 *          description: the name user
 *          example: Luis Fernando
 *        email:
 *          type: string
 *          description: the email user
 *          example: luis@gmail.com
 *        role:
 *          type: string
 *          description: the role user
 *          example: admin
 *        permissions:
 *          type: array
 *          description: the permissions user
 *          items:
 *            $ref: '#/components/schemas/Permission'
 *      required:
 *        - id
 *        - name
 *        - email
 *        - role
 *        - permissions
 */
