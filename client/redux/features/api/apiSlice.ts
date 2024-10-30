import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_SERVER_URL
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => {
                return {
                    url: 'auth/refresh-token',
                    method: 'GET',
                    credentials: 'include' as const
                };
            }
        }),
        loadUser: builder.query({
            query: () => {
                return {
                    url: 'profile',
                    method: 'GET',
                    credentials: 'include' as const
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                        })
                    );
                } catch (error: any) {
                    console.log('hello', error);
                }
            }
        })
    })
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
