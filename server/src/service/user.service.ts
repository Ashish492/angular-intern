import createHttpError from 'http-errors'
import {} from '@prisma/client'
import { User, UserDto } from '../dto'
import { runService } from '../utils'
import { UserModel } from '../model'
import { FilterQuery } from 'mongoose'
import { omit } from 'lodash'
export const insertUser = async (userData: UserDto) => {
  try {
    const data = userData
    let result = await UserModel.create(userData)
    result = result.toObject()
    return { ...omit(result, '_id'), id: result['_id'] }
  } catch (error: unknown) {
    if ((error as any)?.code === 11000) {
      throw new Error('Duplicate data error: User or email already exists.')
    }
    throw createHttpError(500, (error as Error)?.message ?? 'unable to  create user', {
      cause: {
        error,
      },
    })
  }
}
export const findUserByEmail = async (email: string) => {
  return runService(async () => UserModel.findOne({ email }).lean())
}
export const getUser = (filter: FilterQuery<User> = {}) => {
  return runService(async () => UserModel.find(filter))
}
export const getUsers = (condition: object, sort: string, page: number, pageSize: number) => {
  const filter = condition ?? {}
  let query = UserModel.find(filter)
  if (page) {
    const take = pageSize ?? 10
    const skip = (page - 1) * pageSize
    query = query.skip(skip).limit(take)
  }
  const sortOptions: any = {}
  if (sort) {
    const sortFields = sort.split(',') // Split sort fields if multiple fields are provided
    for (const field of sortFields) {
      if (field.startsWith('-')) {
        sortOptions[field.slice(1)] = -1 // Sort in descending order
      } else {
        sortOptions[field] = 1 // Sort in ascending order
      }
    }
  }
  query = query.sort(sortOptions)
  runService(async () => {
    const result = await query
    console.log(result)
    return result
  })
}
export const removeUserByID = (id: string) => {
  runService(async () => UserModel.findByIdAndDelete(id), 'unable to delete user')
}
export const updateUserById = (id: string, data: UserDto) => {
  return runService(
    async () =>
      UserModel.findByIdAndUpdate(id, data, {
        new: true,
        returnDocument: 'after',
      }),
    'unable to update'
  )
}
