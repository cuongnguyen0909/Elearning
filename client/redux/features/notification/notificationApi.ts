import { apiSlice } from '../api/apiSlice';

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: 'notification',
        method: 'GET',
        credentials: 'include' as const
      })
    }),
    updateNotificationStatus: builder.mutation({
      query: ({ id }) => ({
        url: `notification/${id}`,
        method: 'PUT',
        credentials: 'include' as const
      })
    })
  })
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } = notificationApi;
