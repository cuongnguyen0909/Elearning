import { Template } from './../../../node_modules/@types/ejs/index.d';
import nodemailer, { Transporter } from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

interface IEmailOptions {
    email: string,
    subject: string,
    template: string,
    data: {
        [key: string]: any
    }
}

const SENDER: string = 'QNU ELearning'

const sendRegistrationMail = async (options: IEmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    } as nodemailer.TransportOptions)

    const { email, subject, template, data } = options

    //get path of mail template file
    const mailTemplatePath: string = path.join(__dirname, `../../templates`, template)
    // console.log(mailTemplatePath);

    //render the email template with ejs
    const html: string = await ejs.renderFile(mailTemplatePath, data)

    //render the email template with ejs
    const mailOptions: any = {
        from: SENDER,
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)
}

export default sendRegistrationMail