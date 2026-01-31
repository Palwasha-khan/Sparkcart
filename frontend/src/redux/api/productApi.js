import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
  reducerPath: 'productApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),

 endpoints: (builder) => ({
 getProducts: builder.query({
  query: ({ page = 1, keyword = '', min = 0, max = 0 , category = ''}) => {
    const params = new URLSearchParams()
    params.set('page', page)

    if (keyword) params.set('keyword', keyword)
    if (min > 0) params.set('price[gte]', min)
    if (max > 0) params.set('price[lte]', max)
    if (category) params.set('category', category)

    return `/products?${params.toString()}`
  },
 }),
    
    getProductDetails: builder.query({
      query: (id) => `/product/${id}`,
    }),

 
 }),
})

export const { useGetProductsQuery , useGetProductDetailsQuery} = productApi
