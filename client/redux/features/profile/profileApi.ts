import { apiSlice } from '../api/apiSlice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: 'profile/change-avatar',
        method: 'PUT',
        body: {
          avatar
        },
        credentials: 'include' as const
      })
    }),
    updateProfile: builder.mutation({
      query: (data: any) => {
        const { name } = data;
        return {
          url: 'profile',
          method: 'PUT',
          body: {
            name
          },
          credentials: 'include' as const
        };
      }
    }),
    updatePassword: builder.mutation({
      query: (data: any) => {
        const { currentPassword, newPassword } = data;
        return {
          url: 'profile',
          method: 'PUT',
          body: {
            currentPassword,
            newPassword
          },
          credentials: 'include' as const
        };
      }
    }),
    markCompleteVideo: builder.mutation({
      query: ({ courseId, contentId, contentTitle }: any) => ({
        url: 'profile/mark-complete-video',
        method: 'PUT',
        credentials: 'include' as const,
        body: {
          courseId,
          contentId,
          contentTitle
        }
      })
    })
  })
});

export const {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useMarkCompleteVideoMutation
} = profileApi;
