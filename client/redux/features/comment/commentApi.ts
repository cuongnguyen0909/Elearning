import { apiSlice } from '../api/apiSlice';

const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: ({ comment, courseId, contentId }) => ({
        url: `comment/add`,
        method: 'POST',
        body: {
          comment,
          courseId,
          contentId
        },
        credentials: 'include' as const
      })
    }),
    deleteComment: builder.mutation({
      query: ({ commentId, courseId, contentId }) => ({
        url: `comment/delete`,
        method: 'DELETE',
        body: {
          commentId,
          courseId,
          contentId
        },
        credentials: 'include' as const
      })
    }),
    replyComment: builder.mutation({
      query: ({ reply, commentId }) => ({
        url: `comment/reply`,
        method: 'PUT',
        body: {
          reply,
          commentId
        },
        credentials: 'include' as const
      })
    })
  })
});

export const { useAddCommentMutation, useDeleteCommentMutation, useReplyCommentMutation } = commentApi;
