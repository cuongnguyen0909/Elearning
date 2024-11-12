import { apiSlice } from '../api/apiSlice';

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: 'course/admin',
                method: 'POST',
                body: data,
                credentials: 'include' as const
            })
        }),
        editCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `course/update/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const
            })
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: 'course/admin',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getAllCoursesByUser: builder.query({
            query: () => ({
                url: 'course',
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});

export const { useCreateCourseMutation, useGetAllCoursesQuery, useEditCourseMutation, useGetAllCoursesByUserQuery } =
    courseApi;
