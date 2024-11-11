import { apiSlice } from '../api/apiSlice';

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnalytics: builder.query({
            query: () => ({
                url: `analytic/courses`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getEnreollmentsAnalytics: builder.query({
            query: () => ({
                url: `analytic/enrollments`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getUsersAnalytics: builder.query({
            query: () => ({
                url: `analytic/users`,
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});

export const { useGetCoursesAnalyticsQuery, useGetEnreollmentsAnalyticsQuery, useGetUsersAnalyticsQuery } =
    analyticsApi;
