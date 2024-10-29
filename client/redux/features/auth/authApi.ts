import { apiSlice } from '../api/apiSlice';
import { userRegistration } from './authSlice';

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
                    }
                };
            }
        })
    })
});

export const { useRegisterMutation, useActivateMutation } = authApi;
