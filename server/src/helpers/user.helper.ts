import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IUser } from '../models/schemas/user.schema'

const getAllUsers = async () => {
    try {
        //find all user with isDeleted false
        const users: IUser[] = (await UserModel.find({
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .populate({
                path: 'courses'
            })) as IUser[]
        return users
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const userHelper = {
    getAllUsers
}
