import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../middlewares/catch-async-error";
import UserModel from "../../models/user.model";
import ErrorHandler from "../../utils/handlers/ErrorHandler";
import sendRegistrationMail from '../../utils/mails/send-mail';
import { createActivationToken } from './user.help';

export interface IRegistration {
    name: string,
    email: string,
    password: string
    avatar?: string
}

export const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as IRegistration
        //check email is already exist
        const isEmailExist: boolean = await UserModel.findOne({ email }) as boolean
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
        const activationCode: number = activationToken.activationCode
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