import dotenv from 'dotenv'
import { redis } from '../configs/connect.redis.config'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'
import { ICourse } from '../models/schemas/course.schema'
import { CourseModel } from '../models/course.model'
import { profileHelpers } from '../helpers/profile.helper'
dotenv.config()

const getProfileById = async (uid: string) => {
    try {
        const userSession: any = (await redis.get(uid)) as any
        if (!userSession) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }
        const user: IUser = (await profileHelpers.getProfileById(uid)) as IUser
        redis.set(uid, JSON.stringify(user) as any)
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updateProfile = async (userId: string, userData: any) => {
    try {
        const { name } = userData as IUpdateProfileRequest
        const user: IUser = (await UserModel.findById(userId).select('-role')?.populate({
            path: 'courses'
        })) as IUser

        //check email is already exist or not
        // if (email && user) {
        //     const isEmailExist: IUser = (await UserModel.findOne({ email })) as IUser
        //     if (isEmailExist) {
        //         throw new ErrorHandler('Email is already exist', StatusCodes.BAD_REQUEST)
        //     }
        //     user.email = email
        // }

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
            throw new ErrorHandler('Mật khẩu mới phải khác với mật khẩu cũ.', StatusCodes.BAD_REQUEST)
        }

        const user: IUser = (await UserModel.findById(userId).select('+password -role')) as IUser

        //check login by social then password is not set
        if (!user.password) {
            throw new ErrorHandler('Không tìm thấy mật khẩu.', StatusCodes.BAD_REQUEST)
        }

        //check password is matched or not
        const isPasswordMatched: boolean = await user.comparePassword(currentPassword)
        //check wrong pasword
        if (!isPasswordMatched) {
            throw new ErrorHandler('Mật khẩu không đúng.', StatusCodes.BAD_REQUEST)
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

const markCompletedContent = async (userId: string, courseId: string, contentId: string, contentTitle: string) => {
    try {
        const user: IUser | null = await UserModel.findById(userId)
        if (!user) {
            throw new ErrorHandler('Không tìm thấy tài khoản.', StatusCodes.NOT_FOUND)
        }

        const course: ICourse | null = await CourseModel.findById(courseId)
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }

        // Kiểm tra xem video đã hoàn thành hay chưa
        const isVideoCompleted = user.completedVideos.some(
            (content: any) => content?.course?.toString() === courseId && content?.contentId?.toString() === contentId
        )
        if (isVideoCompleted) {
            throw new ErrorHandler('Hoàn thành bài học. Hãy chuyển sang bài học tiếp theo.', StatusCodes.BAD_REQUEST)
        }

        // Tìm contentId trong course.contents
        const content = course.contents.find((content: any) => content?._id?.toString() === contentId)
        if (!content) {
            throw new ErrorHandler('Bài học này không có trong khóa học.', StatusCodes.NOT_FOUND)
        }

        // Thêm content vào danh sách hoàn thành
        user.completedVideos.push({
            course: courseId,
            contentId,
            contentTitle,
            isCompleted: true
        })

        await user.save()
        // Cập nhật cache (nếu cần)
        const userAfterUpdated: IUser | null = (await profileHelpers.getProfileById(userId)) as IUser
        await redis.set(userId, JSON.stringify(userAfterUpdated) as any)

        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const profileServices = {
    getProfileById,
    updateProfile,
    updatePassword,
    uploadImage,
    markCompletedContent
}
