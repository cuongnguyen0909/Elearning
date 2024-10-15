import mongoose, { Schema } from 'mongoose'
export interface IEnroll {
    user: mongoose.Types.ObjectId
    course: mongoose.Types.ObjectId
    payment_method: string
}
export const enrollmentSchema: Schema<IEnroll> = new Schema<IEnroll>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course: {
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
