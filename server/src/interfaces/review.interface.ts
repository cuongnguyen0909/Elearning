export interface IReviewRequest {
    review: string
    rating: string
}

export interface IReplyReviewRequest {
    reply: string
    reviewId: string
    courseId: string
}
