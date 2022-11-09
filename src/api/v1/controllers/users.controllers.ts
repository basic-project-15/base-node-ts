import { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { DataResponse, UserCreate, UserProfile } from '@interfaces'
import { bcryptSalt } from '@config'
import { permissionsModels, usersModels } from '@common/models'
import { Roles } from '@common/types'

const getUsers = async (_req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  try {
    const users = await usersModels.find().exec()
    const usersFormat: UserProfile[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }))
    dataResponse.message = 'Usuarios listados'
    dataResponse.data = usersFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const getUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idUser: string = req.params.idUser
  try {
    const user = await usersModels.findById(idUser).exec()

    // Validations
    if (!user) {
      dataResponse.message = 'Usuario no encontrado'
      return res.status(404).send(dataResponse)
    }

    // Actions
    const userFormat: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }
    dataResponse.message = 'Usuario encontrado'
    dataResponse.data = userFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const createUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
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
      dataResponse.message = 'Ya existe un usuario con ese correo electrónico'
      return res.status(409).send(dataResponse)
    }

    // Actions
    newUser.password = await hash(newUser.password, bcryptSalt)
    const userModel = new usersModels(newUser)
    const { password, ...userProfile } = newUser
    await userModel.save()
    dataResponse.message = 'Usuario creado'
    dataResponse.data = {
      id: userModel._id,
      ...userProfile,
    }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const updateUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idUser: string = req.params.idUser
  const newUser = req.body
  try {
    const user = await usersModels.findById(idUser).exec()
    const userFind = await usersModels.findOne({ email: newUser.email }).exec()

    // Validations
    if (!user) {
      dataResponse.message = 'Usuario no encontrado'
      return res.status(404).send(dataResponse)
    }
    if (userFind?.email && userFind.email !== user.email) {
      dataResponse.message = 'Ya existe un usuario con ese correo electrónico'
      return res.status(409).send(dataResponse)
    }
    if (user.role === Roles.SuperAdmin && req.user.role !== Roles.SuperAdmin) {
      dataResponse.message = 'No puede editar a un usuario super administrador'
      return res.status(400).send(dataResponse)
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
    dataResponse.message = 'Usuario actualizado'
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idUser: string = req.params.idUser
  try {
    const user = await usersModels.findById(idUser).exec()

    // Validations
    if (!user) {
      dataResponse.message = 'Usuario no encontrado'
      return res.status(404).send(dataResponse)
    }
    if (user.email === req.user.email) {
      dataResponse.message = 'No se puede eliminar a si mismo'
      return res.status(400).send(dataResponse)
    }
    if (user.role === Roles.SuperAdmin && req.user.role !== Roles.SuperAdmin) {
      dataResponse.message =
        'No puede eliminar a un usuario super administrador'
      return res.status(400).send(dataResponse)
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
    dataResponse.message = 'Usuario eliminado'
    dataResponse.data = userFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const assignPermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idUser: string = req.params.idUser
  const { idPermission } = req.body
  try {
    const user = await usersModels.findById(idUser).exec()
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!user) {
      dataResponse.message = 'Usuario no encontrado'
      return res.status(404).send(dataResponse)
    }
    if (!permission) {
      dataResponse.message = 'Permiso no encontrado'
      return res.status(404).send(dataResponse)
    }
    const permissionFind = user.permissions.find(
      permission => permission._id.toString() === idPermission,
    )
    if (permissionFind) {
      dataResponse.message = 'Permiso ya asignado'
      return res.status(409).send(dataResponse)
    }
    if (user.role === Roles.SuperAdmin) {
      dataResponse.message =
        'Este usuario ya cuenta con el rango más alto de permisos'
      return res.status(400).send(dataResponse)
    }

    // Actions
    user.permissions.push(permission)
    await user.save()
    dataResponse.message = 'Permiso asignado'
    dataResponse.data = permission
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const removePermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idUser: string = req.params.idUser
  const { idPermission } = req.body
  try {
    const user = await usersModels.findById(idUser).exec()
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!user) {
      dataResponse.message = 'Usuario no encontrado'
      return res.status(404).send(dataResponse)
    }
    if (!permission) {
      dataResponse.message = 'Permiso no encontrado'
      return res.status(404).send(dataResponse)
    }
    const permissionFind = user.permissions.find(
      permission => permission._id.toString() === idPermission,
    )
    if (!permissionFind) {
      dataResponse.message = 'Permiso ya removido'
      return res.status(409).send(dataResponse)
    }

    // Actions
    const permissionIndex = user.permissions.findIndex(
      permission => permission._id.toString() === idPermission,
    )
    user.permissions.splice(permissionIndex, 1)
    await user.save()
    dataResponse.message = 'Permiso removido'
    dataResponse.data = permission
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  assignPermission,
  removePermission,
}
