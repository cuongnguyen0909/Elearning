import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'

const getProfileById = async (uid: string) => {
    try {
        const updatedUser: IUser = (await UserModel.findById(uid).populate({
            path: 'courses'
        })) as unknown as IUser
        return updatedUser
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const profileHelpers = {
    getProfileById
}
