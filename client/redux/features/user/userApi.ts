import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: 'user/all',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        updateUserRole: builder.mutation({
            query: (data) => {
                const { email } = data;
                return {
                    url: `user/update`,
                    method: 'PUT',
                    body: { email },
                    credentials: 'include' as const
                };
            }
        }),
        deleteUserAdminRole: builder.mutation({
            query: (data) => {
                const { email } = data;
                return {
                    url: `user/delete`,
                    method: 'PUT',
                    body: { email },
                    credentials: 'include' as const
                };
            }
        }),
        deleteUser: builder.mutation({
            query: (data) => {
                const { id } = data;
                return {
                    url: `user/delete/${id}`,
                    method: 'PUT',
                    credentials: 'include' as const
                };
            }
        }),
        blockUser: builder.mutation({
            query: (data) => {
                const { userId } = data;
                return {
                    url: `user/lock`,
                    method: 'PUT',
                    body: { userId },
                    credentials: 'include' as const
                };
            }
        }),
        unLockuser: builder.mutation({
            query: (data) => {
                const { id } = data;
                return {
                    url: `user/unlock/${id}`,
                    method: 'PUT',
                    credentials: 'include' as const
                };
            }
        })
    })
});

export const {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserAdminRoleMutation,
    useDeleteUserMutation,
    useBlockUserMutation,
    useUnLockuserMutation
} = userApi;
