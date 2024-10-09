import { NextFunction, Request, Response } from 'express'

const fileValidatorMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // const file: any = req?.file as any
    // if (!file) {
    //     res.status(400).json({ message: 'No file uploaded' })
    //     return
    // }
    // const mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    // if (!mimeTypes.includes(file.mimetype)) {
    //     res.status(400).json({ message: 'File format should be JPG' })
    //     return
    // }
    // next()
}

export default fileValidatorMiddleware
