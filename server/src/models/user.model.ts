import mongoose, { Model } from 'mongoose'
import { IUser, userSchema } from './schemas/user.schema'

export const UserModel: Model<IUser> = mongoose.model('User', userSchema)
