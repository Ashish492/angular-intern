import { omit } from 'lodash'
import { CustomRouteFunction } from '../types'
import { User, UserDto } from '../dto'
import { findUserByEmail, insertUser, removeUserByID } from '../service'
import {} from '../utils'
import { getUser, updateUserById } from '../service/user.service'
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
export const updateUser: CustomRouteFunction<UserDto, Pick<User, 'id'>> = async (req, res) => {
  let user = await updateUserById(req.params.id, req.body)
  console.log(user?.toJSON())
  res.json(user?.toJSON())
}
export const getUsersHandler: CustomRouteFunction<unknown, {}, Record<string, any>> = async (req, res) => {
  // const { _sortBy = '', _page, _pageSize, ...filter } = req.query
  // const product = await getUsers(filter || {}, _sortBy, _page, _pageSize)
  // console.log(product)
  const { name } = req.query as any
  let filterQuery = {}
  console.log(req.query)
  if (name) {
    filterQuery = {
      name: { $regex: new RegExp(`${name}`, 'i') },
    }
  }
  const users = await getUser(filterQuery)
  res.json(users)
}
