import mongoose from 'mongoose'
mongoose.set('runValidators', true)
export default function connectToDB() {
  return mongoose.connect(process.env.DATABASE_URL)
}
