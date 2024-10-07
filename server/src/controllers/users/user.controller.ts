import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import catchAsyncError from "../../utils/handlers/catch-async-error";
import UserModel from "../../models/user.model";
import ErrorHandler from "../../utils/handlers/ErrorHandler";
import sendRegistrationMail from '../../utils/mails/send-mail';
import { createActivationToken } from './user.help';
import { IActivationToken, IRegistration, ILoginRequest, IUser, IUserVerify, IActivationRequest } from "../../interfaces/user.interface";
import { sendToken } from "../../utils/jwt/jwt";
import { redis } from "../../utils/database/connect-redis";


//register user
export const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req?.body as IRegistration
        //check email is already exist
        const isEmailExist: IUser = await UserModel.findOne({ email }) as IUser
        if (isEmailExist) {
            return next(new ErrorHandler('Email is already exist', 400))
        }
        const user: IRegistration = {
            name,
            email,
            password
        }
        //create activation token
        const activationToken: IActivationToken = createActivationToken(user)
        //create activation code
        const activationCode: string = activationToken?.activationCode
        // initialize data to send email
        const data: any = {
            user: {
                name: user?.name
            },
            activationCode
        }

        try {
            await sendRegistrationMail({
                email: user?.email,
                subject: 'Active your account',
                template: 'activation-mail.template.ejs',
                data
            })

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user?.email} to activate your account`,
                activationToken: activationToken.token
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))

        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//activate user
export const userActivation = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activationCode, activationToken } = req?.body as IActivationRequest
        const newUser: IUserVerify = jwt.verify(
            activationToken,
            process.env.ACTIVATION_SERCRET_KEY as string
        ) as IUserVerify

        if (newUser && newUser?.activationCode !== activationCode) {
            return next(new ErrorHandler('Invalid activation code', 400))
        }

        const { name, email, password } = newUser?.user

        const existingUser: IUser = await UserModel.findOne({ email }) as IUser

        if (existingUser) {
            return next(new ErrorHandler('User is already exist', 400))
        }

        await UserModel.create({
            name,
            email,
            password
        })

        res.status(200).json({
            success: true,
            message: 'User is created successfully'
        })
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//login user
export const userLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req?.body as ILoginRequest
        //check email or password is entered or not
        if (!email || !password) {
            return next(new ErrorHandler('Please enter email and password', 400))
        }
        //check user is exist or not
        const user: IUser = await UserModel.findOne({ email }).select('+password') as IUser
        //check password is matched or not
        const isPasswordMatched: boolean = await user?.comparePassword(password)
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401))
        }

        sendToken(user, 200, res)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//logout user
export const userLogout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie('accessToken', '', { maxAge: 1 })
        res.cookie('refreshToken', '', { maxAge: 1 })
        const userId: any = req?.user?._id as any
        await redis.del(userId)
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})