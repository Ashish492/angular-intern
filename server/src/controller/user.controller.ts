import { omit } from 'lodash'
import { CustomRouteFunction } from '../types'
import { User, UserDto } from '../dto'
import { findUserByEmail, getUsers, insertUser, removeUserByID } from '../service'
import { db } from '../utils'
export const createUserHandler: CustomRouteFunction<UserDto> = async (req, res) => {
  const data = omit(req.body, 'rePassword')
  const user = await insertUser(data)
  res.json(user)
}
export const getUserByEmailHandler: CustomRouteFunction<unknown, Pick<UserDto, 'email'>> = async (req, res) => {
  const user = await findUserByEmail(req.params.email)
  res.json(user)
}
export const deleteUser: CustomRouteFunction<unknown, Pick<User, 'id'>> = async (req, res) => {
  const user = await removeUserByID(req.params.id)
  res.json(user)
}
export const getUsersHandler: CustomRouteFunction<unknown, {}, Record<string, any>> = async (req, res) => {
  const { _sortBy = '', _page, _pageSize, ...filter } = req.query
  // const condition = Object.entries(filter).reduce(([key, value]) => {
  //   if (key.includes('_')) {
  //     const keyArray = key.split('_')
  //   }
  // })
  const sortBy = _sortBy.split(',').reduce((acc: Record<string, any>, value: string) => {
    const valueArray = value.split(':')
    acc[valueArray[0]] = ['asc', 'desc'].includes(valueArray[1]) ? valueArray[1] : 'asc'
    return acc
  }, {})
  const product = await getUsers(filter || {}, sortBy, _page, _pageSize)
  res.json({ data: product, total: db.user.count() })
}
