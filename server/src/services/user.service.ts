import dotenv from 'dotenv'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { UserRole } from '../constants/enums/user.enum'
dotenv.config()

const getAllUser = async () => {
    try {
        const users: IUser[] = (await UserModel.find().sort({ createdAt: -1 }).populate({
            path: 'courses'
        })) as IUser[]
        return users
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

const updateUserRole = async (currentUserId: string, userId: string) => {
    try {
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (currentUserId === userId) {
            throw new ErrorHandler('You can not update your own role', 400)
        }
        if (user.role === UserRole.ADMIN) {
            throw new ErrorHandler('You can not update admin role', 400)
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { role: UserRole.ADMIN }, { new: true })
        return updatedUser
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

const lockUser = async (userId: string) => {
    try {
        const updatedUser: IUser = (await UserModel.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        )) as IUser
        return updatedUser
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}
const unLockUser = async (userId: string) => {
    try {
        const updatedUser: IUser = (await UserModel.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        )) as IUser
        return updatedUser
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

export const userServices = {
    getAllUser,
    updateUserRole,
    lockUser,
    unLockUser
}
