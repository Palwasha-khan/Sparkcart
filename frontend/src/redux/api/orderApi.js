import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1',}),
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
    myOrders:builder.query({
         query: () => `/me/orders`,
    }),
    orderDetails: builder.query({
         query: (id) => `/orders/${id}`,
    })
 }),

})

export const { useCreateNewOrderMutation, useMyOrdersQuery,useOrderDetailsQuery} =orderApi
