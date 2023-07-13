import mongoose, { Schema, Document } from 'mongoose'
import { Admin } from '../dto'
export type IAdmin = Omit<Admin, 'rePassword'> & Document
const AdminSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
})
AdminSchema.virtual('id').get(function (this: IAdmin) {
  return this._id.toHexString()
})
const AdminModel = mongoose.model<IAdmin>('admin', AdminSchema)
export default AdminModel
