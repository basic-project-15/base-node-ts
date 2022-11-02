import { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { UserCreate, UserProfile } from '@interfaces/index'
import { permissionsModels, usersModels } from '@common/models'
import { bcryptSalt } from '@config/index'

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await usersModels.find().exec()
    const usersFormat: UserProfile[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }))
    return res.status(200).send({
      message: 'Usuarios listados',
      data: usersFormat,
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
    const user = await usersModels.findById(idUser).exec()

    // Validations
    if (!user) {
      return res.status(404).send({
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    // Actions
    const userFormat: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }
    return res.status(200).send({
      message: 'Usuario encontrado',
      data: userFormat,
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
    const newUser: UserCreate = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      permissions: [],
    }

    // Validations
    const userFind = await usersModels.findOne({ email: newUser.email }).exec()
    if (userFind) {
      return res.status(409).send({
        message: 'Ya existe un usuario con ese correo electrónico',
        data: null,
      })
    }

    // Actions
    newUser.password = await hash(newUser.password, bcryptSalt)
    const userModel = new usersModels(newUser)
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
    const user = await usersModels.findById(idUser).exec()
    const userFind = await usersModels.findOne({ email: newUser.email }).exec()

    // Validations
    if (!user) {
      return res.status(404).send({
        message: 'Usuario no encontrado',
        data: null,
      })
    }
    if (userFind?.email && userFind.email !== user.email) {
      return res.status(409).send({
        message: 'Ya existe un usuario con ese correo electrónico',
        data: null,
      })
    }

    // Actions
    let newPassword: string = ''
    if (newUser.password) {
      newPassword = await hash(newUser.password, bcryptSalt)
    }
    user.name = newUser.name || user.name
    user.email = newUser.email || user.email
    user.password = newPassword || user.password
    user.role = newUser.role || user.role
    await user.save()
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
    const user = await usersModels.findById(idUser).exec()

    // Validations
    if (!user) {
      return res.status(404).send({
        message: 'Usuario no encontrado',
        data: null,
      })
    }
    if (user.email === req.user.email) {
      return res.status(404).send({
        message: 'No se puede eliminar a si mismo',
        data: null,
      })
    }

    // Actions
    const userFormat: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions ?? [],
    }
    await user.remove()
    return res.status(200).send({
      message: 'Usuario eliminado',
      data: userFormat,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const assignPermission = async (req: Request, res: Response) => {
  const idUser: string = req.params.idUser
  const { idPermission } = req.body
  try {
    const user = await usersModels.findById(idUser).exec()
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!user) {
      return res.status(404).send({
        message: 'Usuario no encontrado',
        data: null,
      })
    }
    if (!permission) {
      return res.status(404).send({
        message: 'Permiso no encontrado',
        data: null,
      })
    }
    const permissionFind = user.permissions.find(
      permission => permission._id.toString() === idPermission,
    )
    if (permissionFind) {
      return res.status(409).send({
        message: 'Permiso ya asignado',
        data: null,
      })
    }

    // Actions
    user.permissions.push(permission)
    await user.save()
    return res.status(200).send({
      message: 'Permiso asignado',
      data: permission,
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
  assignPermission,
}
