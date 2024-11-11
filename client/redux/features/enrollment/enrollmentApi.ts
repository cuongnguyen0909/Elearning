import { apiSlice } from '../api/apiSlice';

export const enrollmentApli = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllEnrollments: builder.query({
            query: () => ({
                url: '/enrollment',
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});
export const { useGetAllEnrollmentsQuery } = enrollmentApli;
