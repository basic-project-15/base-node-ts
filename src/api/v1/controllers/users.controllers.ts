import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { hash } from 'bcrypt'
import type { DataResponse } from '@interfaces'
import { bcrypt } from '@config'
import { ROLES } from '@common'
import { MODELS } from '@api/v1'

export const getUsers = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const usersFound = await MODELS.Users.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'idRole',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: '$role',
      },
      {
        $project: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          role: '$role.description',
        },
      },
    ])
    dataResponse.message = t('USERS_GetUsers')
    dataResponse.data = usersFound
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const idUser: string = req.params.idUser
  try {
    const userFound = await MODELS.Users.aggregate([
      {
        $match: { $expr: { $eq: ['$_id', { $toObjectId: idUser }] } },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'idRole',
          foreignField: '_id',
          as: 'role',
        },
      },
      { $unwind: '$role' },
      {
        $project: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          photo: 1,
          created_at: 1,
          created_by: 1,
          updated_at: 1,
          updated_by: 1,
          idRole: 1,
          role: '$role',
        },
      },
    ])

    // Validations
    if (userFound == null) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }

    // Actions
    dataResponse.message = t('USERS_GetUser')
    dataResponse.data = userFound[0]
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

export const createUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    // Validations
    const userFound = await MODELS.Users.findOne({ email: body.email }).exec()
    const roleFound = await MODELS.Roles.findById(body.idRole).exec()
    if (userFound != null) {
      dataResponse.message = t('USERS_AlreadyExists')
      return res.status(409).send(dataResponse)
    }
    if (roleFound == null) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (
      roleFound?.type === ROLES.SuperAdmin &&
      userToken.role.type !== ROLES.SuperAdmin
    ) {
      dataResponse.message = t('USERS_CreateSuperAdmin')
      return res.status(400).send(dataResponse)
    }

    // Actions
    const newPassword = await hash(body.password, bcrypt.SALT)
    const currentDate = new Date()
    const userCreator = new mongoose.mongo.ObjectId('64906d9a9f292dd10840e73b') // <-- Cambiar por el idUser del token
    const newUser = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: newPassword,
      photo: body.photo,
      idRole: body.idRole,
      created_at: currentDate,
      created_by: userCreator,
      updated_at: currentDate,
      updated_by: userCreator,
    }
    const userModel = new MODELS.Users(newUser)
    const { password, ...userProfile } = newUser
    await userModel.save()
    dataResponse.message = t('USERS_CreateUser')
    dataResponse.data = { _id: userModel.id, ...userProfile }
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  const idUser: string = req.params.idUser
  try {
    const userFoundById = (
      await MODELS.Users.aggregate([
        {
          $match: { $expr: { $eq: ['$_id', { $toObjectId: idUser }] } },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'idRole',
            foreignField: '_id',
            as: 'role',
          },
        },
        { $unwind: '$role' },
        {
          $project: {
            id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phoneNumber: 1,
            photo: 1,
            created_at: 1,
            created_by: 1,
            updated_at: 1,
            updated_by: 1,
            idRole: 1,
            role: '$role',
          },
        },
      ])
    )[0]
    const userFoundByEmail = await MODELS.Users.findOne({
      email: body.email,
    }).exec()
    const roleFound = await MODELS.Roles.findById(body.idRole).exec()

    // Validations
    if (userFoundById == null) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (body.idRole != null && roleFound == null) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (
      userFoundByEmail?.email != null &&
      userFoundByEmail.email !== userFoundById.email
    ) {
      dataResponse.message = t('USERS_AlreadyExists')
      return res.status(409).send(dataResponse)
    }
    if (
      userFoundById.role.type === ROLES.SuperAdmin &&
      userToken.role.type !== ROLES.SuperAdmin
    ) {
      dataResponse.message = t('USERS_EditSuperAdmin')
      return res.status(400).send(dataResponse)
    }
    if (
      userToken._id === userFoundById._id &&
      userToken.role._id !== body.idRole
    ) {
      dataResponse.message = t('USERS_ChangeRoleYourself')
      return res.status(400).send(dataResponse)
    }

    // Actions
    const userModifier = new mongoose.mongo.ObjectId('64906d9a9f292dd10840e73b') // <-- Cambiar por el idUser del token
    const currentDate = new Date()
    const roleIdObject = new mongoose.mongo.ObjectId(
      body.idRole ?? userFoundById.idRole,
    )
    let newPassword = ''
    if (body.password.length > 0) {
      newPassword = await hash(body.password, bcrypt.SALT)
    }
    await MODELS.Users.updateOne(
      { _id: userFoundById._id },
      {
        $set: {
          firstName: body.firstName ?? userFoundById.firstName,
          lastName: body.lastName ?? userFoundById.lastName,
          email: body.email ?? userFoundById.email,
          phoneNumber: body.phoneNumber ?? userFoundById.phoneNumber,
          photo: body.photo ?? userFoundById.photo,
          password: newPassword ?? userFoundById.password,
          idRole: roleIdObject,
          updated_at: currentDate,
          updated_by: userModifier,
        },
      },
    )
    dataResponse.message = t('USERS_UpdateUser')
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t, userToken } = req
  const idUser: string = req.params.idUser
  try {
    const userFound = (
      await MODELS.Users.aggregate([
        {
          $match: { $expr: { $eq: ['$_id', { $toObjectId: idUser }] } },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'idRole',
            foreignField: '_id',
            as: 'role',
          },
        },
        { $unwind: '$role' },
        {
          $project: {
            id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phoneNumber: 1,
            photo: 1,
            created_at: 1,
            created_by: 1,
            updated_at: 1,
            updated_by: 1,
            idRole: 1,
            role: '$role',
          },
        },
      ])
    )[0]

    // Validations
    if (userFound == null) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (userFound.id === userToken._id) {
      dataResponse.message = t('USERS_DeletYourself')
      return res.status(400).send(dataResponse)
    }
    if (
      userFound.role.type === ROLES.SuperAdmin &&
      userToken.role.type !== ROLES.SuperAdmin
    ) {
      dataResponse.message = t('USERS_DeleteSuperAdmin')
      return res.status(400).send(dataResponse)
    }

    // Actions
    await MODELS.Users.deleteOne({ _id: new mongoose.mongo.ObjectId(idUser) })
    dataResponse.message = t('USERS_DeleteUser')
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}
