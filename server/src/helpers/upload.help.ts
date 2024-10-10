import cloudinary from '../configs/cloudinary.config'

export const uploadFile = async (folder: string, fileName: string): Promise<any> => {
    return await cloudinary.uploader.upload(fileName, {
        folder,
        width: 150
    })
}

export const deleteFile = async (publicId: string): Promise<any> => {
    return await cloudinary.uploader.destroy(publicId)
}
