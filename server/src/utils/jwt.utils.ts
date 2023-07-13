import jwt, { Secret } from 'jsonwebtoken'
import logger from './logger'

export const signJWT = async (object: object, options?: jwt.SignOptions) => {
  const secret: Secret | undefined = process.env.SECRET
  if (!secret) {
    throw new Error('JWT secret is not defined')
  }
  return jwt.sign(object, secret, {
    ...options,
  })
}
export const verifyJwt = async (token: string) => {
  logger.info(process.env.PUBLIC_KEY)
  try {
    const secret: Secret | undefined = process.env.SECRET
    if (!secret) {
      throw new Error('JWT secret is not defined')
    }
    const decoded = await jwt.verify(token, secret)
    return { decoded, expired: false, valid: true }
  } catch (error: unknown) {
    return {
      valid: false,
      expired: (<Error>error).message === 'jwt expired',
      decoded: null,
    }
  }
}
export const decodedPayload = async (token: string) => {
  const decoded = await jwt.decode(token, {
    json: true,
  })
  return decoded
}