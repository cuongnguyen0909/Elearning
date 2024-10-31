import dotenv from 'dotenv'
import { redis } from '../configs/connect.redis.config'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'
dotenv.config()

const getProfileById = async (uid: string) => {
    try {
        const userSession: any = (await redis.get(uid)) as any
        if (!userSession) {
            throw new ErrorHandler('User not found', StatusCodes.NOT_FOUND)
        }
        const user: IUser = JSON.parse(userSession) as IUser
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updateProfile = async (userId: string, userData: any) => {
    try {
        const { email, name } = userData as IUpdateProfileRequest
        const user: IUser = (await UserModel.findById(userId).select('-role')) as IUser

        //check email is already exist or not
        if (email && user) {
            const isEmailExist: IUser = (await UserModel.findOne({ email })) as IUser
            if (isEmailExist) {
                throw new ErrorHandler('Email is already exist', StatusCodes.BAD_REQUEST)
            }
            user.email = email
        }

        if (name && user) {
            user.name = name
        }

        await user?.save()
        await redis.set(userId, JSON.stringify(user) as any)
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updatePassword = async (updatePasswordRequest: IUpdatePasswordRequest, userId: any) => {
    try {
        const { currentPassword, newPassword } = updatePasswordRequest

        //check new password is different from current password
        if (currentPassword === newPassword) {
            throw new ErrorHandler('New password must be different from current password', StatusCodes.BAD_REQUEST)
        }

        const user: IUser = (await UserModel.findById(userId).select('+password -role')) as IUser

        //check login by social then password is not set
        if (!user.password) {
            throw new ErrorHandler('Password is not set', StatusCodes.BAD_REQUEST)
        }

        //check password is matched or not
        const isPasswordMatched: boolean = await user.comparePassword(currentPassword)
        //check wrong pasword
        if (!isPasswordMatched) {
            throw new ErrorHandler('Password is incorrect', StatusCodes.BAD_REQUEST)
        }

        user.password = newPassword
        await user?.save()
        await redis.set(userId, JSON.stringify(user) as any)
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const uploadImage = async (userId: any, upadteAvatarRequest: IUpdateAvatarRequest) => {
    try {
        const { avatar } = upadteAvatarRequest
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (avatar && user && user?.avatar?.public_id) {
            await deleteFile(user.avatar.public_id.toString())
            const myCloud = await uploadFile('avatar', avatar.toString())
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        } else {
            const myCloud = await uploadFile('avatar', avatar.toString())
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        await user?.save()
        await redis.set(userId, JSON.stringify(user) as any)
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const profileServices = {
    getProfileById,
    updateProfile,
    updatePassword,
    uploadImage
}
