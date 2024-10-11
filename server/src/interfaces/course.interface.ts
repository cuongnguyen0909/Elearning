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
