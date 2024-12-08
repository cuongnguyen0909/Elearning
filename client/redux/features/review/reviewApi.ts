import { apiSlice } from '../api/apiSlice';

const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => '/review'
    }),
    addReview: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `/review/add/${courseId}`,
        method: 'POST',
        body: {
          review,
          rating
        },
        credentials: 'include' as const
      })
    }),
    replyToReview: builder.mutation({
      query: ({ reply, reviewId, courseId }) => ({
        url: '/review/reply',
        method: 'PUT',
        body: {
          reply,
          reviewId,
          courseId
        },
        credentials: 'include' as const
      })
    }),
    deleteReviewReply: builder.mutation({
      query: ({ reviewId, replyId }) => ({
        url: '/review/reply',
        method: 'DELETE',
        body: {
          reviewId,
          replyId
        },
        credentials: 'include' as const
      })
    }),
    getAllReviews: builder.query({
      query: () => {
        return {
          url: '/review/all',
          credentials: 'include' as const
        };
      }
    })
  })
});

export const { useAddReviewMutation, useReplyToReviewMutation, useDeleteReviewReplyMutation, useGetAllReviewsQuery } =
  reviewApi;
