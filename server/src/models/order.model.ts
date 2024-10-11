import mongoose, { Model } from 'mongoose'
import { IOrder, orderSchema } from './schemas/order.schema'

export const OrderModel: Model<IOrder> = mongoose.model('Order', orderSchema)
