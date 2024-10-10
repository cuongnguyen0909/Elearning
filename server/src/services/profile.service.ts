import dotenv from 'dotenv'
import cloudinary from '../configs/cloudinary.config'
import { redis } from '../configs/connect.redis.config'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import { IUser, UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { deleteFile, uploadFile } from '../helpers/upload.help'
dotenv.config()

const getProfileById = async (uid: string) => {
    const userSession: any = (await redis.get(uid)) as any
    if (!userSession) {
        throw new ErrorHandler('User not found', 404)
    }
    const user: IUser = JSON.parse(userSession) as IUser
    return user
}

const updateProfile = async (userId: string, userData: any) => {
    const { email, name } = userData as IUpdateProfileRequest
    const user: IUser = (await UserModel.findById(userId).select('-role')) as IUser

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

    //check new password is different from current password
    if (currentPassword === newPassword) {
        throw new ErrorHandler('New password must be different from current password', 400)
    }

    const user: IUser = (await UserModel.findById(userId).select('+password -role')) as IUser

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
        await deleteFile(user.avatar.public_id)
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

export const profileServices = {
    getProfileById,
    updateProfile,
    updatePassword,
    uploadImage
}
