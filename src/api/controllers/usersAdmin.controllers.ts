import { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { UserAdminCreate, UserAdminProfile } from '@interfaces/index'
import { usersAdminModels } from '@common/models'
import { bcryptSalt } from '@config/index'

const getUsers = async (_req: Request, res: Response) => {
  try {
    const userAdmins = await usersAdminModels.find().exec()
    const usersAdminsFormat: UserAdminProfile[] = userAdmins.map(user => ({
      id: user.id,
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role ?? '',
    }))
    return res.status(200).send({
      message: 'Usuarios listados',
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
    const userAdminFormat: UserAdminProfile = {
      id: userAdmin.id,
      name: userAdmin.name ?? '',
      email: userAdmin.email ?? '',
      role: userAdmin.role ?? '',
    }
    return res.status(200).send({
      message: 'Usuario encontrado',
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
    const newUser: UserAdminCreate = {
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
    newUser.password = await hash(newUser.password, bcryptSalt)
    const userModel = new usersAdminModels(newUser)
    const { password, ...userProfile } = newUser
    await userModel.save()
    return res.status(200).send({
      message: 'Usuario creado',
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

const updateUser = async (req: Request, res: Response) => {
  const idUser: string = req.params.idUser
  const newUser = req.body
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
    let newPassword: string = ''
    if (newUser.password) {
      newPassword = await hash(newUser.password, bcryptSalt)
    }
    userAdmin.name = newUser.name || userAdmin.name
    userAdmin.email = newUser.email || userAdmin.email
    userAdmin.password = newPassword || userAdmin.password
    userAdmin.role = newUser.role || userAdmin.role
    await userAdmin.save()
    return res.status(200).send({
      message: 'Usuario actualizado',
      data: null,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
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
    const userAdminFormat: UserAdminProfile = {
      id: userAdmin.id,
      name: userAdmin.name ?? '',
      email: userAdmin.email ?? '',
      role: userAdmin.role ?? '',
    }
    await userAdmin.remove()
    return res.status(200).send({
      message: 'Usuario eliminado',
      data: userAdminFormat,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
