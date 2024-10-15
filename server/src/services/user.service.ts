import dotenv from 'dotenv'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
dotenv.config()

const getAllUser = async () => {
    try {
        const users: IUser[] = (await UserModel.find().sort({ createdAt: -1 })) as IUser[]
        return users
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

export const userServices = {
    getAllUser
}
