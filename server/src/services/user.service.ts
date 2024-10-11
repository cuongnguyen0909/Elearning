import dotenv from 'dotenv'
import cloudinary from '../configs/cloudinary.config'
import { redis } from '../configs/connect.redis.config'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { deleteFile, uploadFile } from '../helpers/upload.help'
dotenv.config()

export const userServices = {}
