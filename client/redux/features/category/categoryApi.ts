import { create } from 'domain';
import { apiSlice } from '../api/apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => ({
                url: `category/all`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        createCategory: builder.mutation({
            query: ({ title }) => ({
                url: `category/create`,
                method: 'POST',
                credentials: 'include' as const,
                body: { title }
            })
        }),
        editCategory: builder.mutation({
            query: ({ id, title }) => ({
                url: `category/update/${id}`,
                method: 'PUT',
                credentials: 'include' as const,
                body: { title }
            })
        }),
        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `category/delete/${id}`,
                method: 'DELETE',
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useEditCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;
