export interface IEnrollRequest {
    courseId: string
    payment_method: string
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
