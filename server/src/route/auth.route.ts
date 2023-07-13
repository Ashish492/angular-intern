import { Router } from 'express'
import {} from '../middleware'
import {} from '../dto'
import loginHandler from '../controller/auth.controller'
import { customRouteFunction } from '../utils'
const authRouter = Router()
authRouter.route('/login').post(customRouteFunction(loginHandler))
// authRouter.route('/refresh').post(customRouteFunction(issueToken))
// authRouter.route('/validate').post(customRouteFunction(validateToken))
// authRouter.route('/payload').get(customRouteFunction(getPayload))
// authRouter.route('/logOut').post(customRouteFunction(logOut))
export default authRouter
