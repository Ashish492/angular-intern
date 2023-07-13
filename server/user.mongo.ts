import mongoose, { Model } from "mongoose";
import { compare, genSalt, hash } from "bcrypt"
import config from "config"
import { User } from "../types/user.types";
export interface UserDocument extends User,mongoose.Document{}
interface UserMethod{
 comparePassword(password:string):Promise<boolean>
}

type UserMethodModel=Model<UserDocument,{},UserMethod>
const userSchema = new mongoose.Schema<UserDocument,UserMethodModel,UserMethod>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
    }, {timestamps: true}
)
userSchema.pre("save",async function(next){
    let  user= this as unknown as UserDocument
    if(!user.isModified("password")){
        return next()
    }
const salt=await  genSalt(config.get<number>('saltWorkFactor') )
const hashPassword= await hash(user.password,salt);
user.password=hashPassword;
return next();
})
userSchema.methods.comparePassword=async function (password:string):Promise<boolean> {
const user=this as unknown as UserDocument
return compare(password, user.password).catch(e=>false)
}
export const UserModel = mongoose.model<UserDocument,UserMethodModel>("User", userSchema)
