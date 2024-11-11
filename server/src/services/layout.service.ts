import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { LayoutModel } from '../models/layout.model'

export interface IFAQRequest {
    faq: [
        {
            question: string
            answer: string
        }
    ]
}

const createLayout = async (
    type: string,
    image: string,
    title: string,
    subtitle: string,
    faq: any,
    categories: any
) => {
    try {
        const isTypeExist = (await LayoutModel.findOne({ type })) as any
        if (isTypeExist) {
            throw new ErrorHandler(`${type} already exist`, StatusCodes.BAD_REQUEST)
        }
        if (type === 'Banner') {
            const myCloud = await uploadFile('layout', image)
            const banner = {
                image: {
                    public_id: myCloud?.public_id,
                    url: myCloud?.url
                },
                title,
                subtitle
            }
            return await LayoutModel.create({ type, banner })
        }
        if (type === 'FAQ') {
            const faqItems = await Promise.all(
                faq?.map(async (item: any) => {
                    return {
                        question: item?.question,
                        answer: item?.answer
                    }
                })
            )
            return await LayoutModel.create({ type, faq: faqItems })
        }
        if (type === 'Categories') {
            const categoryItems = await Promise.all(
                categories?.map(async (item: any) => {
                    return {
                        title: item?.title
                    }
                })
            )
            return await LayoutModel.create({ type, categories: categoryItems })
        }
        throw new ErrorHandler('Invalid type', StatusCodes.BAD_REQUEST)
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const editLayout = async (type: string, image: string, title: string, subtitle: string, faq: any, categories: any) => {
    try {
        if (type === 'Banner') {
            const bannerData: any = await LayoutModel.findOne({ type: 'Banner' })
            if (!bannerData) {
                throw new ErrorHandler('Banner not found', StatusCodes.NOT_FOUND)
            }
            if (bannerData) {
                await deleteFile(bannerData?.image?.public_id)
            }
            const myCloud = await uploadFile('layout', image)
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.url
                },
                title,
                subtitle
            }
            return await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner })
        }
        if (type === 'FAQ') {
            const faqData: any = await LayoutModel.findOne({ type: 'FAQ' })
            if (!faqData) {
                throw new ErrorHandler('FAQ not found', StatusCodes.NOT_FOUND)
            }
            const faqItems = await Promise.all(
                faq?.map(async (item: any) => {
                    return {
                        question: item?.question,
                        answer: item?.answer
                    }
                })
            )
            return await LayoutModel.findByIdAndUpdate(faqData?._id, { type: 'FAQ', faq: faqItems })
        }
        if (type === 'Categories') {
            const categoryData: any = await LayoutModel.findOne({ type: 'Categories' })
            if (!categoryData) {
                throw new ErrorHandler('Categories not found', StatusCodes.NOT_FOUND)
            }
            const categoryItem = await Promise.all(
                categories?.map(async (item: any) => {
                    return {
                        title: item?.title
                    }
                })
            )
            return await LayoutModel.findByIdAndUpdate(categoryData?._id, {
                type,
                categories: categoryItem
            })
        }
        throw new ErrorHandler('Invalid type', StatusCodes.BAD_REQUEST)
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getLayoutByType = async (type: string) => {
    try {
        if (!type || !['Banner', 'FAQ', 'Categories'].includes(type)) {
            throw new ErrorHandler('Invalid type', StatusCodes.BAD_REQUEST)
        }
        const layout = await LayoutModel.findOne({ type })
        if (!layout) {
            throw new ErrorHandler(`${type} not found`, StatusCodes.NOT_FOUND)
        }
        return layout
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const layoutServices = {
    createLayout,
    editLayout,
    getLayoutByType
}
