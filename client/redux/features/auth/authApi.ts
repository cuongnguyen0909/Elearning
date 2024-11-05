import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut, userRegistration } from './authSlice';

type RegistrationResponse = {
    message: string;
    activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add a `register` endpoint:
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: 'auth/register',
                method: 'POST',
                body: data,
                credentials: 'include' as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),
        activate: builder.mutation({
            query: (data) => {
                const { activationCode, activationToken } = data;
                return {
                    url: 'auth/activate',
                    method: 'POST',
                    body: {
                        activationCode,
                        activationToken
                    },
                    credentials: 'include' as const
                };
            }
        }),
        login: builder.mutation({
            query: (data) => {
                const { email, password } = data;
                return {
                    url: 'auth/login',
                    method: 'POST',
                    body: {
                        email,
                        password
                    },
                    credentials: 'include' as const
                };
            },
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),
        socialLogin: builder.mutation({
            query: (data) => {
                const { email, name, avatar } = data;
                return {
                    url: 'auth/social',
                    method: 'POST',
                    body: {
                        email,
                        name,
                        avatar
                    },
                    credentials: 'include' as const
                };
            },
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),
        logout: builder.query({
            query: () => ({
                url: 'auth/logout',
                method: 'GET',
                credentials: 'include' as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedOut());
                } catch (error: any) {
                    console.log(error);
                }
            }
        })
    })
});

export const { useRegisterMutation, useActivateMutation, useLoginMutation, useSocialLoginMutation, useLogoutQuery } =
    authApi;
