import { Request, Response } from 'express'
import { UsersAdminCreate } from '@interfaces/usersAdmin'
import { usersAdminModels } from '@common/models'

const getUsers = (_req: Request, res: Response) => {
  return res.status(200).send('usersAdmin get')
}

const getUser = (_req: Request, res: Response) => {
  return res.status(200).send('usersAdmin get by id')
}

const createUser = async (req: Request, res: Response) => {
  const { body } = req
  try {
    const newUser: UsersAdminCreate = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    }

    // Validations
    const userFind = await usersAdminModels
      .findOne({ email: newUser.email })
      .exec()
    if (userFind) {
      return res.status(409).send({
        message: 'Ya existe un usuario con ese correo electrónico',
        data: null,
      })
    }

    // Actions
    const userModel = new usersAdminModels(newUser)
    userModel.save()
    let { password, ...userProfile } = newUser
    return res.status(200).send({
      message: 'usersAdmin post',
      data: {
        id: userModel._id,
        ...userProfile,
      },
    })
  } catch (error) {
    return res.status(400).send({
      message: 'Error al guardar el usuario',
      data: error,
    })
  }
}

const updateUser = (_req: Request, res: Response) => {
  return res.status(200).send('usersAdmin patch')
}

const deleteUser = (_req: Request, res: Response) => {
  return res.status(200).send('usersAdmin delete')
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
