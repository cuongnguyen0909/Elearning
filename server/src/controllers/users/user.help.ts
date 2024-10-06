import { IUser } from "../../models/user.model"
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { IRegistration } from "./user.controller"
//using dotenv to access environment variables
dotenv.config()

interface IActivationToken {
    token: string,
    activationCode: string
}
export const createActivationToken = (user: IRegistration): IActivationToken => {
    //generate activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    //create activation token
    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SERCRET_KEY as Secret,
        { expiresIn: '5m' }
    )

    return { token, activationCode }
}