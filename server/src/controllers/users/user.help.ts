import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { IActivationToken, IRegistration } from '../../interfaces/user.interface'
//using dotenv to access environment variables
dotenv.config()

export const createActivationToken = (user: IRegistration): IActivationToken => {
    //generate activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    //create activation token
    const token: string = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SERCRET_KEY as string,
        { expiresIn: '5m' }
    )

    return { token, activationCode }
}