import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../middlewares/catch-async-error";
import UserModel, { IUser } from "../../models/user.model";
import ErrorHandler from "../../utils/handlers/ErrorHandler";
import sendRegistrationMail from '../../utils/mails/send-mail';
import { createActivationToken } from './user.help';

export interface IRegistration {
    name: string,
    email: string,
    password: string
    avatar?: string
}

interface IActivationRequest {
    activationCode: string,
    activationToken: string
}

interface IUserVerify {
    user: IUser,
    activationCode: string
}

export const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req?.body as IRegistration
        //check email is already exist
        const isEmailExist: IUser = await UserModel.findOne({ email }) as IUser
        if (isEmailExist) {
            return next(new ErrorHandler('Email is already exist', 400))
        }
        //create new user
        const user: IRegistration = {
            name,
            email,
            password
        }

        //create activation token
        const activationToken: any = createActivationToken(user)
        //create activation code
        const activationCode: number = activationToken?.activationCode
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