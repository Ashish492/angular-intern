import { Router } from 'express'
import { UserDtoSchema, userSchema } from '../dto'
import { createUserHandler, deleteUser, getUserByEmailHandler, getUsersHandler, updateUser } from '../controller'
import { customRouteFunction } from '../utils'
import { auth, bodyValidator, getValidateObject, validate } from '../middleware'
const userRouter = Router()
userRouter
  .route('/')
  .post(auth(), bodyValidator(UserDtoSchema), customRouteFunction(createUserHandler))
  .get(auth(), customRouteFunction(getUsersHandler))
userRouter
  .route('/:id')
  .delete(auth(), validate(getValidateObject(userSchema.pick({ id: true }))), customRouteFunction(deleteUser))
  .patch(
    auth(),
    validate(getValidateObject(userSchema.pick({ id: true }), UserDtoSchema.partial())),
    customRouteFunction(updateUser)
  )
userRouter
  .route('/:email')
  .get(validate(getValidateObject(userSchema.pick({ email: true }))), customRouteFunction(getUserByEmailHandler))
export default userRouter
