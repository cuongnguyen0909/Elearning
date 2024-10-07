import dotenv from 'dotenv';
import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
dotenv.config()

interface IEmailOptions {
    email: string,
    subject: string,
    template: string,
    data: {
        [key: string]: any
    }
}

const sendRegistrationMail = async (options: IEmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        service: process.env.SMTP_SERVICE,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    } as nodemailer.TransportOptions)

    const { email, subject, template, data } = options

    //get path of mail template file
    const mailTemplatePath: string = path.join(__dirname, `../../templates`, template)
    //render the email template with ejs
    const html: string = await ejs.renderFile(mailTemplatePath, data)

    //render the email template with ejs
    const mailOptions: any = {
        from: '"QNU ELearning" <noreply@support.elearningQNU@gmail.com>',
        replyTo: 'noreply@support.elearningQNU@gmail.com',
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)
}

export default sendRegistrationMail