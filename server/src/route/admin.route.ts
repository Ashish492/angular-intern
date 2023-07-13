import { createAdminHandler, deleteAdmin} from '../controller'
import { AdminDtoSchema, adminSchema} from '../dto'
import { Router } from 'express'
import { auth, bodyValidator, getValidateObject, validate } from '../middleware'
import { customRouteFunction } from '../utils'
const adminRouter = Router()
adminRouter.route('/').post(bodyValidator(AdminDtoSchema), customRouteFunction(createAdminHandler))
adminRouter.delete(
  '/:id',
  auth(),
  validate(getValidateObject(adminSchema.pick({ id: true }))),
  customRouteFunction(deleteAdmin)
)
export default adminRouter
