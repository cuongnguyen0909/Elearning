export interface ICommentRequest {
    comment: string
    courseId: string
    contentId: string
}

export interface IReplyCommentRequest {
    reply: string
    courseId: string
    contentId: string
    commentId: string
}

export interface IReviewRequest {
    review: string
    rating: string
}

export interface IReplyReviewRequest {
    reply: string
    reviewId: string
    courseId: string
}
