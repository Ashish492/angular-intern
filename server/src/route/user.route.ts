import { Router } from 'express'
import { UserDtoSchema, userSchema } from '../dto'
import { createUserHandler, deleteUser, getUserByEmailHandler, getUsersHandler } from '../controller'
import { customRouteFunction } from '../utils'
import { auth, bodyValidator, getValidateObject, validate } from '../middleware'
const userRouter = Router()
userRouter
  .route('/')
  .post(bodyValidator(UserDtoSchema), customRouteFunction(createUserHandler))
  .get(customRouteFunction(getUsersHandler))
userRouter.delete(
  '/:id',
  auth(),
  validate(getValidateObject(userSchema.pick({ id: true }))),
  customRouteFunction(deleteUser)
)
userRouter
  .route('/:email')
  .get(validate(getValidateObject(userSchema.pick({ email: true }))), customRouteFunction(getUserByEmailHandler))
export default userRouter
