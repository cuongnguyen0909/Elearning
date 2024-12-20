import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../configs/connect.redis.config'
import { TypeOfEmail } from '../constants/user.constant'
import {
    IActivationRequest,
    IActivationToken,
    ILoginRequest,
    IRegistrationRequest,
    ISocialAuthRequest,
    IUserVerify
} from '../interfaces/user.interface'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import sendMail from '../utils/mails/send-mail'
import { StatusCodes } from 'http-status-codes'
import { authHelper } from '../helpers/auth.helper'
dotenv.config()

const registerUser = async (userData: IRegistrationRequest) => {
    try {
        const { name, email, password } = userData

        // Check if email already exists
        const isEmailExist: IUser = (await UserModel.findOne({ email })) as IUser
        if (isEmailExist) {
            throw new ErrorHandler('Email đã tồn tại. Vui lòng thử email khác.', StatusCodes.BAD_REQUEST)
        }

        const user: IRegistrationRequest = { name, email, password }
        const activationToken: IActivationToken = authHelper.generateActivationToken(user)
        const activationCode: string = activationToken.activationCode

        // Send activation email
        const data = {
            user: {
                name: user.name
            },
            activationCode
        }
        await sendMail(
            {
                email: user.email,
                subject: 'Activate your account',
                template: 'activation-mail.template.ejs',
                data
            },
            TypeOfEmail.ACTIVATE
        )

        return { activationToken: activationToken.token, email: user.email }
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const activateUser = async (activationRequest: IActivationRequest) => {
    try {
        const { activationCode, activationToken } = activationRequest
        const newUser: IUserVerify = jwt.verify(
            activationToken,
            process.env.ACTIVATION_SERCRET_KEY as string
        ) as IUserVerify

        //check if activation code is valid
        if (newUser && newUser.activationCode !== activationCode) {
            throw new ErrorHandler('Mã OTP không hợp lệ.', StatusCodes.BAD_REQUEST)
        }
        const { name, email, password } = newUser.user as IUser

        //check if user already exists
        const existingUser: IUser = (await UserModel.findOne({ email })) as IUser

        if (existingUser) {
            throw new ErrorHandler('Người dùng đã tồn tại.', StatusCodes.BAD_REQUEST)
        }

        const user = await UserModel.create({ name, email, password })
        user.isVerified = true
        await user.save()
        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const loginUser = async (loginRequest: ILoginRequest) => {
    try {
        const { email, password } = loginRequest
        //check email or password is entered or not
        if (!email || !password) {
            throw new ErrorHandler('Email và mật khẩu không được bỏ trống', StatusCodes.BAD_REQUEST)
        }

        //check user is exist or not
        //check user with isBlocked and isDeleted is false
        const user: IUser = (await UserModel.findOne({ email }).select('+password').populate({
            path: 'courses'
        })) as IUser
        if (!user) {
            throw new ErrorHandler('Email không đúng. Vui lòng nhập lại', StatusCodes.UNAUTHORIZED)
        }
        if (user.isBlocked || user.isDeleted) {
            throw new ErrorHandler(
                'Tài khoản của bạn không khả dụng. Vui lòng liên hệ với chúng tôi qua email để biết thêm thông tin về tài khoản của bạn',
                StatusCodes.UNAUTHORIZED
            )
        }
        //check password is matched or not
        const isPasswordMatched: boolean = await user?.comparePassword(password)

        //check if password is matched
        if (!isPasswordMatched) {
            return new ErrorHandler('Mật khẩu không chính xác. Vui lòng thử lại', StatusCodes.UNAUTHORIZED)
        }
        //check user is blocked or not
        if (user.isBlocked) {
            throw new ErrorHandler(
                'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với chúng tôi qua email để biết thêm thông tin về tài khoản của bạn',
                StatusCodes.UNAUTHORIZED
            )
        }

        return user
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const logoutUser = async (userId: any) => {
    try {
        await redis.del(userId)
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const createNewAccessToken = async (refreshToken: string) => {
    try {
        const decoded: JwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload
        if (!decoded) {
            throw new ErrorHandler('Invalid refresh token', StatusCodes.BAD_REQUEST)
        }

        const userOfSession: any = await redis.get(decoded?.id as string)
        if (!userOfSession) {
            throw new ErrorHandler('Hãy đăng nhập trước khi truy cập vào tài nguyên này', StatusCodes.NOT_FOUND)
        }

        const user = JSON.parse(userOfSession) as IUser

        const newAccessToken: string = jwt.sign({ id: user?._id }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: '5m'
        })

        const newRefreshToken: string = jwt.sign({ id: user?._id }, process.env.REFRESH_TOKEN_SECRET as string, {
            expiresIn: '3d'
        })

        return { user, newAccessToken, newRefreshToken }
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const loginBySoial = async (socialRequest: ISocialAuthRequest) => {
    try {
        const { email, name, avatar } = socialRequest as ISocialAuthRequest
        //check user is exist or not
        const existingUser: IUser = (await UserModel.findOne({ email })) as IUser
        let user: IUser = existingUser
        //if user is not exist then create new user
        //if user is exist then return user and allow to login
        if (!existingUser) {
            user = await UserModel.create({
                email,
                name,
                avatar: {
                    public_id: '',
                    url: avatar
                }
            })
        }
        return user

        // throw new ErrorHandler('User is already exist', StatusCodes.BAD_REQUEST)
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const authServices = {
    registerUser,
    activateUser,
    loginUser,
    logoutUser,
    createNewAccessToken,
    loginBySoial
}
