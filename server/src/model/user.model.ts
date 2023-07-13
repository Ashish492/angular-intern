import mongoose, { Schema, Document } from 'mongoose'
import { User } from '../dto'
export type IUser = User & Document
const UserSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: String,
  telephone: String,
})
UserSchema.virtual('id').get(function (this: IUser) {
  return this._id.toHexString()
})
export const UserModel = mongoose.model<IUser>('user', UserSchema)
