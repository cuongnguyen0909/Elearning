export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    avatar: {
        public_id: string
        url: string
    }
    role: string
    isVerified: boolean
    courses: Array<{ courseId: string }>
    isModified: (password: string) => boolean
    comparePassword: (password: string) => Promise<boolean>
    signAccessToken: () => string
    signRefreshToken: () => string
    save: () => void
}

export interface IRegistrationRequest {
    name: string
    email: string
    password: string
    avatar?: string
}

export interface ILoginRequest {
    email: string
    password: string
}

export interface IActivationToken {
    token: string
    activationCode: string
}

export interface IActivationRequest {
    activationCode: string
    activationToken: string
}

export interface IUserVerify {
    user: IUser
    activationCode: string
}

export interface ITokenOptions {
    expires: Date
    maxAge: number
    httpOnly: boolean
    sameSite: 'strict' | 'lax' | 'none'
    secure?: boolean
}

export interface ISocialAuthRequest {
    email: string
    name: string
}

export interface IUpdateProfileRequest {
    name: string
    email: string
}

export interface IUpdatePasswordRequest {
    currentPassword: string
    newPassword: string
}

export interface IUpdateAvatarRequest {
    avatar: string
}
