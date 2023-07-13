import createHttpError from 'http-errors'
import { omit } from 'lodash'
import {} from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { Admin, AdminDto } from '../dto'
import { runService } from '../utils'
import AdminModel from '../model/admin.model'
import {} from 'mongoose'
export const insertAdmin = async (adminData: Omit<AdminDto, 'rePassword'>) => {
  try {
    const data = adminData
    data.password = await hash(adminData.password, 10)
    const result = await AdminModel.create(data)
    return omit(result.toObject(), 'password')
  } catch (error: unknown) {
    if ((error as any).code === 11000) {
      throw new Error('Duplicate data error:  username already exists.')
    }
    throw createHttpError(500, (error as Error)?.message ?? 'unable to  create admin', {
      cause: {
        error,
      },
    })
  }
}
export const findAdminByEmail = async (username: string) => {
  return runService(async () => AdminModel.findOne({ username }).select('id username password'))
}
export const validatePassword = async ({ username, password }: Pick<Admin, 'password' | 'username'>) => {
  const admin = await AdminModel.findOne({ username }).select('id username password').lean()
  if (!admin) return false
  const validate = await compare(password, admin.password)
  if (!validate) return false
  return omit(admin, 'password')
}
export const removeAdminByID = (id: string) => {
  runService(async () => AdminModel.findByIdAndDelete(id), 'unable to delete admin')
}
