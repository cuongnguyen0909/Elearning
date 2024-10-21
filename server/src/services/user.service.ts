import dotenv from 'dotenv'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { UserRole } from '../constants/enums/user.enum'
import { redis } from '../configs/connect.redis.config'
import { StatusCodes } from 'http-status-codes'
dotenv.config()

const getAllUser = async () => {
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

const updateUserRole = async (currentUserId: string, userId: string) => {
    try {
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (currentUserId === userId) {
            throw new ErrorHandler('You can not update your own role', StatusCodes.BAD_REQUEST)
        }
        if (user.role === UserRole.ADMIN) {
            throw new ErrorHandler('You can not update admin role', StatusCodes.BAD_REQUEST)
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { role: UserRole.ADMIN }, { new: true })
        return updatedUser
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
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
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
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
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}
const deleteUser = async (userId: string) => {
    try {
        const user: IUser = (await UserModel.findById(userId)) as IUser

        if (!user) {
            throw new ErrorHandler('User not found', StatusCodes.NOT_FOUND)
        }

        if (user.role === UserRole.ADMIN) {
            throw new ErrorHandler('You can not delete admin', StatusCodes.BAD_REQUEST)
        }

        user.isDeleted = true
        await user.save()
        await redis.del(userId)
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const userServices = {
    getAllUser,
    updateUserRole,
    lockUser,
    unLockUser,
    deleteUser
}
