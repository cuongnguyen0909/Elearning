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
        })
    })
});

export const {
    useUpdateAvatarMutation,
    useUpdateProfileMutation,
    useUpdatePasswordMutation
} = profileApi;
