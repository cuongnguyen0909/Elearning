import dotenv from 'dotenv'
import cloudinary from '../config/cloudinary.config'
import { redis } from '../config/connect.redis.config'
import {
    IUpdateAvatarRequest,
    IUpdatePasswordRequest,
    IUpdateProfileRequest,
    IUser
} from '../interfaces/user.interface'
import UserModel from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { uploadFile } from '../helpers/user.help'
dotenv.config()
//call cloudinary

const getUserById = async (uid: string) => {
    const userSession: any = (await redis.get(uid)) as any
    if (!userSession) {
        throw new ErrorHandler('User not found', 404)
    }
    const user: IUser = JSON.parse(userSession) as IUser
    return user
}

const updateUserInfo = async (userId: string, userData: any) => {
    const { email, name } = userData as IUpdateProfileRequest
    const user: IUser = (await UserModel.findById(userId)) as IUser

    //check email is already exist or not
    if (email && user) {
        const isEmailExist: IUser = (await UserModel.findOne({ email })) as IUser
        if (isEmailExist) {
            throw new ErrorHandler('Email is already exist', 400)
        }
        user.email = email
    }

    if (name && user) {
        user.name = name
    }

    await user?.save()
    await redis.set(userId, JSON.stringify(user) as any)
    return user
}

const updatePassword = async (updatePasswordRequest: IUpdatePasswordRequest, userId: any) => {
    const { currentPassword, newPassword } = updatePasswordRequest

    if (currentPassword === newPassword) {
        throw new ErrorHandler('New password must be different from current password', 400)
    }

    const user: IUser = (await UserModel.findById(userId).select('+password')) as IUser

    //check login by social then password is not set
    if (!user.password) {
        throw new ErrorHandler('Password is not set', 400)
    }

    //check password is matched or not
    const isPasswordMatched: boolean = await user.comparePassword(currentPassword)
    //check wrong pasword
    if (!isPasswordMatched) {
        throw new ErrorHandler('Password is incorrect', 400)
    }

    user.password = newPassword
    await user?.save()
    await redis.set(userId, JSON.stringify(user) as any)
    return user
}

const uploadImage = async (userId: any, upadteAvatarRequest: IUpdateAvatarRequest) => {
    const { avatar } = upadteAvatarRequest
    const user: IUser = (await UserModel.findById(userId)) as IUser
    if (avatar && user && user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(user?.avatar?.public_id)
        const myCloud = await uploadFile('avatar', avatar)
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    } else {
        const myCloud = await uploadFile('avatar', avatar)
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    await user?.save()
    await redis.set(userId, JSON.stringify(user) as any)
    return user
}

export const userServices = {
    getUserById,
    updateUserInfo,
    updatePassword,
    uploadImage
}
