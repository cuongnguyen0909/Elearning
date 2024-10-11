import mongoose from 'mongoose'
import { IUser, userSchema } from './schemas/user.schema'

export const UserModel: mongoose.Model<IUser> = mongoose.model('User', userSchema)
