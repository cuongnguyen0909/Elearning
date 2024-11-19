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
    }),
    getCoursesById: builder.query({
      query: (id) => ({
        url: `course/${id}`,
        method: 'GET',
        credentials: 'include' as const
      })
    }),
    getCourseContentAccessible: builder.query({
      query: (id) => ({
        url: `course/${id}`,
        method: 'GET',
        credentials: 'include' as const
      })
    }),
    // Query mới: Tìm kiếm và lọc
    searchCourses: builder.query({
      query: ({ keyword, category }) => ({
        url: `course/search`,
        method: 'GET',
        params: { keyword, category },
        credentials: 'include' as const
      })
    })
  })
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useEditCourseMutation,
  useGetAllCoursesByUserQuery,
  useGetCoursesByIdQuery,
  useGetCourseContentAccessibleQuery,
  useSearchCoursesQuery
} = courseApi;
