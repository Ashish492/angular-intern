import createHttpError from 'http-errors'
import { pick } from 'lodash'
import { CustomRouteFunction } from '../types'
import { AdminDto } from '../dto'
import { validatePassword } from '../service'
import { signJWT } from '../utils'
const loginHandler: CustomRouteFunction<Pick<AdminDto, 'username' | 'password'>> = async (req, res) => {
  try {
    const user = await validatePassword(req.body)
    if (!user) throw new Error()
    const payload = pick(user, ['id', 'email'])
    // const accessToken = await signJWT(payload, {
    //   expiresIn: process.env.ACCESS_TOKEN_TTL,
    // })
    const token = await signJWT(payload, {
      expiresIn: process.env.REFRESH_TOKEN_TTL,
    })
    // res.cookie('refreshToken', refreshToken, {
    //   signed: true,
    //   httpOnly: true,
    //   expires: add(new Date(), {
    //     years: 1,
    //   }),
    // })
    res.send({ token, user: payload })
  } catch (error) {
    throw createHttpError(403, 'invalid email or password')
  }
}
export default loginHandler
// export const issueToken: CustomRouteFunction = async (req, res) => {
//   const { refreshToken } = req.signedCookies
//   if (!refreshToken) throw new createHttpError[403]()
//   const { decoded, valid } = await verifyJwt(refreshToken)
//   if (valid && decoded) {
//     const user = await findUserByEmail(decoded.email)
//     if (user) {
//       let payload = pick(user, ['email', 'id', 'email'])
//       const accessToken = await signJWT(payload, {
//         algorithm: 'RS256',
//         expiresIn: process.env.ACCESS_TOKEN_TTL,
//       })
//       return res.json({
//         token: accessToken,
//         user: payload,
//       })
//     }
//   }
//   throw new createHttpError[403]()
// }
// export const logOut: CustomRouteFunction = async (req, res) => {
//   res.clearCookie('refreshToken')
//   res.json({ success: true, msg: 'logout successfully' })
// }
// export const validateToken: CustomRouteFunction = async (req, res, next) => {
//   const authHeader = req.headers.authorization
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.substring(7)
//     let payload = await verifyJwt(token)
//     if (payload.valid) {
//       res.json(payload.decoded)
//     } else {
//       throw new createHttpError[401]()
//     }
//   } else {
//     throw new createHttpError[403]()
//   }
// }
// export const getPayload: CustomRouteFunction = async (req, res) => {
//   const authHeader = req.headers.authorization
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.substring(7)
//     let payload = await decodedPayload(token)
//     res.json(omit(payload, ['iat', 'exp']))
//   } else {
//     throw new createHttpError[403]()
//   }
// }
