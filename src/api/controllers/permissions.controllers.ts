import { Request, Response } from 'express'

const getPermissions = async (_req: Request, res: Response) => {
  try {
    return res.status(200).send({
      message: 'getPermissions',
      data: null,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const createPermission = async (req: Request, res: Response) => {
  const permission = req.body
  try {
    return res.status(200).send({
      message: 'createPermission',
      data: permission,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const deletePermission = async (_req: Request, res: Response) => {
  try {
    return res.status(200).send({
      message: 'deletePermissions',
      data: null,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default { getPermissions, createPermission, deletePermission }
