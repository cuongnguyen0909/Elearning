export interface IEnrollRequest {
    courseId: string
    payment_info: any
}

export interface IEnrollMailData {
    enroll: {
        courseId: string
        courseName: string
        price: number
        date: string
    }
    userName: string
}
