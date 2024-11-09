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

const updateUserRole = async (currentUserId: string, email: string) => {
    try {
        if (!email) {
            throw new ErrorHandler('Email không được bỏ trống', StatusCodes.BAD_REQUEST)
        }
        const isUserExist: IUser = (await UserModel.findOne({ email })) as IUser
        const userId = isUserExist?._id.toString()
        if (currentUserId === userId) {
            throw new ErrorHandler('Bạn không thể tự cập nhật quyền của mình!', StatusCodes.BAD_REQUEST)
        }
        // if (user.role === UserRole.ADMIN) {
        //     throw new ErrorHandler('You can not update admin role', StatusCodes.BAD_REQUEST)
        // }
        let updatedUser: IUser | null = null
        if (!isUserExist) {
            throw new ErrorHandler('Không tìm thấy người dùng này!', StatusCodes.NOT_FOUND)
        } else if (isUserExist.role === UserRole.USER) {
            updatedUser = (await UserModel.findByIdAndUpdate(userId, { role: UserRole.ADMIN }, { new: true })) as IUser
        } else if (isUserExist.role === UserRole.ADMIN) {
            updatedUser = (await UserModel.findByIdAndUpdate(userId, { role: UserRole.USER }, { new: true })) as IUser
        }
        if (!updatedUser) {
            throw new ErrorHandler('Cập nhật quyền người dùng không thành công', StatusCodes.INTERNAL_SERVER_ERROR)
        }
        return updatedUser
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteUserAdminRole = async (currentUserId: string, email: string) => {
    try {
        const isUserExist: IUser = (await UserModel.findOne({ email })) as IUser
        const userId = isUserExist?._id.toString()
        if (currentUserId === userId) {
            throw new ErrorHandler('Bạn không thể tự xoá quyền của mình!', StatusCodes.BAD_REQUEST)
        }
        // if (user.role === UserRole.ADMIN) {
        //     throw new ErrorHandler('You can not update admin role', StatusCodes.BAD_REQUEST)
        // }
        let updatedUser: IUser | null = null
        if (!isUserExist) {
            throw new ErrorHandler('Không tìm thấy người dùng này!', StatusCodes.NOT_FOUND)
        } else if (isUserExist.role === UserRole.ADMIN) {
            updatedUser = (await UserModel.findByIdAndUpdate(userId, { role: UserRole.USER }, { new: true })) as IUser
        } else if (isUserExist.role === UserRole.USER) {
            throw new ErrorHandler('Người dùng này không phải là admin!', StatusCodes.BAD_REQUEST)
        }
        if (!updatedUser) {
            throw new ErrorHandler('Cập nhật quyền người dùng không thành công', StatusCodes.INTERNAL_SERVER_ERROR)
        }
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
    deleteUserAdminRole,
    lockUser,
    unLockUser,
    deleteUser
}
