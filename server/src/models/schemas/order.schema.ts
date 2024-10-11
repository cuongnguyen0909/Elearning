import mongoose, { Schema } from 'mongoose'
export interface IOrder {
    userId: mongoose.Types.ObjectId
    courseId: mongoose.Types.ObjectId
    payment_method: string
}
export const orderSchema: Schema<IOrder> = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        payment_method: {
            type: String
        }
    },
    { timestamps: true }
)
