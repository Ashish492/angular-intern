import { omit } from 'lodash'
import { CustomRouteFunction } from '../types'
import { Admin, AdminDto } from '../dto'
import { findAdminByEmail, insertAdmin, removeAdminByID } from '../service'
export const createAdminHandler: CustomRouteFunction<AdminDto> = async (req, res) => {
  const data = omit(req.body, 'rePassword')
  const user = await insertAdmin(data)
  res.json(user)
}
export const getAdminByEmailHandler: CustomRouteFunction<unknown, Pick<AdminDto, 'username'>> = async (req, res) => {
  const user = await findAdminByEmail(req.params.username)
  res.json(user)
}
export const deleteAdmin: CustomRouteFunction<unknown, Pick<Admin, 'id'>> = async (req, res) => {
  const user = await removeAdminByID(req.params.id)
  res.json(user)
}
