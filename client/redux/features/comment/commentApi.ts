import { apiSlice } from '../api/apiSlice';

const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: ({ comment, courseId, contentId }: any) => ({
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
      query: ({ commentId, courseId, contentId }: any) => ({
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
      query: ({ reply, commentId }: any) => ({
        url: `comment/reply`,
        method: 'PUT',
        body: {
          reply,
          commentId
        },
        credentials: 'include' as const
      })
    }),
    deleteReplyComment: builder.mutation({
      query: ({ commentId, replyId }: any) => ({
        url: `comment/delete-reply`,
        method: 'DELETE',
        body: {
          commentId,
          replyId
        },
        credentials: 'include' as const
      })
    }),
    getAllComments: builder.query({
      query: () => ({
        url: `comment/all`,
        method: 'GET',
        credentials: 'include' as const
      })
    })
  })
});

export const {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useReplyCommentMutation,
  useDeleteReplyCommentMutation,
  useGetAllCommentsQuery
} = commentApi;
