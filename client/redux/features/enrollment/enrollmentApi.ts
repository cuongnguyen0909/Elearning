import { apiSlice } from '../api/apiSlice';

export const enrollmentApli = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEnrollments: builder.query({
      query: () => ({
        url: '/enrollment/all',
        method: 'GET',
        credentials: 'include' as const
      })
    }),
    getStripePublishableKey: builder.query({
      query: () => ({
        url: '/enrollment/payment/stripepublishablekey',
        method: 'GET',
        credentials: 'include' as const
      })
    }),
    createPayment: builder.mutation({
      query: (amount) => ({
        url: '/enrollment/payment',
        method: 'POST',
        credentials: 'include' as const,
        body: { amount }
      })
    }),
    createEnrollment: builder.mutation({
      query: ({ course, payment_info }) => ({
        url: '/enrollment/create',
        method: 'POST',
        credentials: 'include' as const,
        body: { course, payment_info }
      })
    })
  })
});
export const {
  useGetAllEnrollmentsQuery,
  useGetStripePublishableKeyQuery,
  useCreatePaymentMutation,
  useCreateEnrollmentMutation
} = enrollmentApli;
