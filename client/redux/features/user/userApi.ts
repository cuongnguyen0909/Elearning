import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getAllUsers: builder.query({
         query: () => ({
            url: 'user/all',
            method: 'GET',
            credentials: 'include' as const
         })
      })
   })
});

export const { useGetAllUsersQuery } = userApi;
