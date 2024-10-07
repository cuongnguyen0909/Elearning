import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from '../interfaces/user.interface';
import { UserRole } from '../constants/user.enum';
dotenv.config()
const emailRegexPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (email: string) {
                return emailRegexPattern.test(email);
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Your password must be at least 6 characters long"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.USER
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String
        }
    ]
}, { timestamps: true })

// Hash password before saving user
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Sign JWT access token
userSchema.methods.signAccessToken = function (): string {
    return jwt.sign(
        { id: this._id },
        process.env.ACCESS_TOKEN_SECRET as string
    )
}

// Sign JWT refresh token
userSchema.methods.signRefreshToken = function (): string {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET as string
    )
}

//compare password when user enter password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

const UserModel: Model<IUser> = mongoose.model('User', userSchema)

export default UserModel