import createHttpError from 'http-errors'
import { omit } from 'lodash'
import { Prisma } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { Admin, AdminDto } from '../dto'
import { db, logger, runService } from '../utils'
export const insertAdmin = async (adminData: Omit<AdminDto, 'rePassword'>) => {
  try {
    const data = adminData
    data.password = await hash(adminData.password, 10)
    const result = await db.admin.create({ data })
    return omit(result, 'password')
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error('Duplicate data error:', error?.meta?.target)
      throw new Error('Duplicate data error: admin or username already exists.')
    }
    throw createHttpError(500, (error as Error)?.message ?? 'unable to  create admin', {
      cause: {
        error,
      },
    })
  }
}
export const findAdminByEmail = async (username: string) => {
  return runService(async () =>
    db.admin.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    })
  )
}
export const validatePassword = async ({ username, password }: Pick<Admin, 'password' | 'username'>) => {
  const admin = await db.admin.findFirst({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
    },
  })
  if (!admin) return false
  const validate = await compare(password, admin.password)
  if (!validate) return false
  return omit(admin, 'password')
}
export const removeAdminByID = (id: string) => {
  runService(
    async () =>
      db.admin.delete({
        where: {
          id,
        },
      }),
    'unable to delete admin'
  )
}
