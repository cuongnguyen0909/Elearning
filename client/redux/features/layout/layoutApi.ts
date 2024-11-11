import { apiSlice } from '../api/apiSlice';

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query: (type) => ({
                url: `layout/${type}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        updateHeroData: builder.mutation({
            query: ({ type, faq }) => ({
                url: `layout/update`,
                method: 'PUT',
                credentials: 'include' as const,
                body: { type, faq }
            })
        })
    })
});

export const { useGetHeroDataQuery, useUpdateHeroDataMutation } = layoutApi;
