import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { hash } from 'bcrypt'
import { DataResponse } from '@interfaces'
import { bcryptSalt } from '@config'
import { rolesModels, usersModels } from '@common/models'
import { Roles } from '@common/types'

const getUsers = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const usersFound = await usersModels.aggregate([
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

const getUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const idUser: string = req.params.idUser
  try {
    const userFound = await usersModels.aggregate([
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
    if (!userFound) {
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

const createUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    // Validations
    const userFound = await usersModels.findOne({ email: body.email }).exec()
    const roleFound = await rolesModels.findById(body.idRole).exec()
    if (userFound) {
      dataResponse.message = t('USERS_AlreadyExists')
      return res.status(409).send(dataResponse)
    }
    if (body.idRole && !roleFound) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (
      roleFound?.type === Roles.SuperAdmin &&
      userToken.role.type !== Roles.SuperAdmin
    ) {
      dataResponse.message = t('USERS_CreateSuperAdmin')
      return res.status(400).send(dataResponse)
    }

    // Actions
    const newPassword = await hash(body.password, bcryptSalt)
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
    const userModel = new usersModels(newUser)
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

const updateUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  const idUser: string = req.params.idUser
  try {
    const userFoundById = (
      await usersModels.aggregate([
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
    const userFoundByEmail = await usersModels
      .findOne({ email: body.email })
      .exec()
    const roleFound = await rolesModels.findById(body.idRole).exec()

    // Validations
    if (!userFoundById) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (body.idRole && !roleFound) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (
      userFoundByEmail?.email &&
      userFoundByEmail.email !== userFoundById.email
    ) {
      dataResponse.message = t('USERS_AlreadyExists')
      return res.status(409).send(dataResponse)
    }
    if (
      userFoundById.role.type === Roles.SuperAdmin &&
      userToken.role.type !== Roles.SuperAdmin
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
      body.idRole || userFoundById.idRole,
    )
    let newPassword: string = ''
    if (body.password) {
      newPassword = await hash(body.password, bcryptSalt)
    }
    await usersModels.updateOne(
      { _id: userFoundById.id },
      {
        $set: {
          firstName: body.firstName || userFoundById.firstName,
          lastName: body.lastName || userFoundById.lastName,
          email: body.email || userFoundById.email,
          phoneNumber: body.phoneNumber || userFoundById.phoneNumber,
          photo: body.photo || userFoundById.photo,
          password: newPassword || userFoundById.password,
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

const deleteUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t, userToken } = req
  const idUser: string = req.params.idUser
  try {
    const userFound = (
      await usersModels.aggregate([
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
    if (!userFound) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (userFound.id === userToken._id) {
      dataResponse.message = t('USERS_DeletYourself')
      return res.status(400).send(dataResponse)
    }
    if (
      userFound.role.type === Roles.SuperAdmin &&
      userToken.role.type !== Roles.SuperAdmin
    ) {
      dataResponse.message = t('USERS_DeleteSuperAdmin')
      return res.status(400).send(dataResponse)
    }

    // Actions
    await usersModels.deleteOne({ _id: new mongoose.mongo.ObjectId(idUser) })
    dataResponse.message = t('USERS_DeleteUser')
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
