import { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { UsersAdminCreate, UsersAdminProfile } from '@interfaces/usersAdmin'
import { usersAdminModels } from '@common/models'
import { SALT } from '@common/constants'

const getUsers = async (_req: Request, res: Response) => {
  try {
    const userAdmins = await usersAdminModels.find().exec()
    const usersAdminsFormat: UsersAdminProfile[] = userAdmins.map(user => ({
      id: user.id,
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role ?? '',
    }))
    return res.status(200).send({
      message: 'usersAdmin get',
      data: usersAdminsFormat,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const getUser = async (req: Request, res: Response) => {
  const idUser: string = req.params.idUser
  try {
    const userAdmin = await usersAdminModels.findById(idUser).exec()

    // Validations
    if (!userAdmin) {
      return res.status(404).send({
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    // Actions
    const userAdminFormat: UsersAdminProfile = {
      id: userAdmin.id,
      name: userAdmin.name ?? '',
      email: userAdmin.email ?? '',
      role: userAdmin.role ?? '',
    }
    return res.status(200).send({
      message: 'usersAdmin get by id',
      data: userAdminFormat,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
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
    newUser.password = await hash(newUser.password, SALT)
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
    return res.status(500).send({
      message: 'Problema interno del servidor',
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
