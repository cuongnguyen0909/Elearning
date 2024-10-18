export interface ICommentRequest {
    comment: string
    courseId: string
    contentId: string
}

export interface IReplyCommentRequest {
    reply: string
    commentId: string
}
