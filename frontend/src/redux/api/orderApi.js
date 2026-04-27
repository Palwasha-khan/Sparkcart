import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react' 

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1'}),
  tagTypes: ["Order","AdminOrders"],
  endpoints: (builder) => ({

    createNewOrder:builder.mutation({
        query(body) {
        return{
            url:"/neworder",
            method:"POST",
            body,
        }
      },
    }),
    stripeCheckoutSession: builder.mutation({
        query(body) {
        return{
            url:"/payment/checkout_session",
            method:"POST",
            body,
        }
      },
    }),
    myOrders:builder.query({
         query: () => `/me/orders`,
         providesTags: ["Order"],
    }),
    orderDetails: builder.query({
         query: (id) => `/orders/${id}`,
    }),
     getDashboardData:builder.query({
         query: ({startDate, endDate}) => `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`,
    }),
    getAdminOrders:builder.query({
         query: () => `/admin/orders`,
         providesTags: ["AdminOrders"],
    }),

    deleteOrder: builder.mutation({
        query(id) {
        return{
            url:`/admin/orders/${id}`,
            method:"DELETE",
        }
      },
      invalidatesTags: ["AdminOrders"],
    }),
      updateOrder: builder.mutation({ 
        query({id, orderStatus}) {
          console.log("What API receives:", { orderStatus }); // Debug here!
        return{
            url:`/admin/orders/${id}`,
            method:"PUT",
            body: { orderStatus }
        }
      },
      invalidatesTags: ["AdminOrders"], 
 }),
}),
})

export const {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardDataQuery,
  useGetAdminOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation
} = orderApi
