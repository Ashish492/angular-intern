import createHttpError from 'http-errors'
import { Prisma } from '@prisma/client'
import { UserDto } from '../dto'
import { db, logger, runService } from '../utils'

export const insertUser = async (userData: UserDto) => {
  try {
    const data = userData
    const result = await db.user.create({ data })
    return result
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error('Duplicate data error:', error?.meta?.target)
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
  return runService(async () =>
    db.user.findUnique({
      where: {
        email,
      },
    })
  )
}
export const getUsers = (condition: object, orderBy: object, page: number, pageSize: number) => {
  const take = page ? undefined : pageSize || 10
  const skip = take ? (page - 1) * take : 0
  return runService(() =>
    db.user.findMany({
      where: condition || {},
      orderBy,
      take,
      skip,
    })
  )
}
export const removeUserByID = (id: string) => {
  runService(
    async () =>
      db.user.delete({
        where: {
          id,
        },
      }),
    'unable to delete user'
  )
}
