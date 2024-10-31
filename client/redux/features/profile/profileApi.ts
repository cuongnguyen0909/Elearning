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
        })
    })
});

export const { useUpdateAvatarMutation } = profileApi;
