import createHttpError from 'http-errors'
import passport from 'passport'
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { JWTPayload } from '../types'
import { findAdminByEmail } from '../service'
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
}
passport.use(
  new Strategy(options, async (payload: JWTPayload, done) => {
    try {
      const user = await findAdminByEmail(payload.username)
      if (user) {
        return done(null, payload)
      }
      throw new Error()
    } catch (error) {
      return done(new createHttpError[401]('unauthorize'), false)
    }
  })
)
export function initializePassport() {
  return passport.initialize()
}
export function auth() {
  return passport.authenticate('jwt', { session: false })
}
export default passport
