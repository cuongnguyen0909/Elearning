import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../configs/connect.redis.config'
import { generateActivationToken } from '../helpers/user.help'
import {
    IActivationRequest,
    IActivationToken,
    ILoginRequest,
    IRegistrationRequest,
    ISocialAuthRequest,
    IUserVerify
} from '../interfaces/user.interface'
import { IUser, UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import sendRegistrationMail from '../utils/mails/send-mail'
dotenv.config()

const registerUser = async (userData: IRegistrationRequest) => {
    const { name, email, password } = userData

    // Check if email already exists
    const isEmailExist: IUser = (await UserModel.findOne({ email })) as IUser
    if (isEmailExist) {
        throw new ErrorHandler('Email is already exist', 400)
    }

    const user: IRegistrationRequest = { name, email, password }
    const activationToken: IActivationToken = generateActivationToken(user)
    const activationCode: string = activationToken.activationCode

    // Send activation email
    const data = { user: { name: user.name }, activationCode }
    await sendRegistrationMail({
        email: user.email,
        subject: 'Activate your account',
        template: 'activation-mail.template.ejs',
        data
    })

    return { activationToken: activationToken.token, email: user.email }
}

const activateUser = async (activationRequest: IActivationRequest) => {
    const { activationCode, activationToken } = activationRequest
    const newUser: IUserVerify = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SERCRET_KEY as string
    ) as IUserVerify

    //check if activation code is valid
    if (newUser && newUser.activationCode !== activationCode) {
        throw new ErrorHandler('Invalid activation code', 400)
    }
    const { name, email, password } = newUser.user as IUser

    //check if user already exists
    const existingUser: IUser = (await UserModel.findOne({ email })) as IUser

    if (existingUser) {
        throw new ErrorHandler('User is already exist', 400)
    }

    const user = await UserModel.create({ name, email, password })

    return user
}

const loginUser = async (loginRequest: ILoginRequest) => {
    const { email, password } = loginRequest
    //check email or password is entered or not
    if (!email || !password) {
        throw new ErrorHandler('Please enter email and password', 400)
    }

    //check user is exist or not
    const user: IUser = (await UserModel.findOne({ email }).select('+password')) as IUser

    //check password is matched or not
    const isPasswordMatched: boolean = await user?.comparePassword(password)

    //check if password is matched
    if (!isPasswordMatched) {
        return new ErrorHandler('Invalid email or password', 401)
    }

    return user
}

const logoutUser = async (userId: any) => {
    await redis.del(userId)
}

const createNewAccessToken = async (refreshToken: string) => {
    const decoded: JwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload
    if (!decoded) {
        throw new ErrorHandler('Invalid refresh token', 400)
    }

    const userOfSession: any = await redis.get(decoded?.id as string)
    if (!userOfSession) {
        throw new ErrorHandler('User not found', 404)
    }

    const user = JSON.parse(userOfSession) as IUser

    const newAccessToken: string = jwt.sign({ id: user?._id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '5m'
    })

    const newRefreshToken: string = jwt.sign({ id: user?._id }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: '3d'
    })

    return { user, newAccessToken, newRefreshToken }
}

const loginBySoial = async (socialRequest: ISocialAuthRequest) => {
    const { email } = socialRequest as ISocialAuthRequest
    //check user is exist or not
    const existingUser: IUser = (await UserModel.findOne({ email })) as IUser
    if (!existingUser) {
        const user = await UserModel.create(socialRequest)
        return user
    }
    throw new ErrorHandler('User is already exist', 400)
}

export const authServices = {
    registerUser,
    activateUser,
    loginUser,
    logoutUser,
    createNewAccessToken,
    loginBySoial
}
