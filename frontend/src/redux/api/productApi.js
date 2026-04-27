import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
  reducerPath: 'productApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  tagTypes:["Product" , "Admin Products" , "Reviews"],

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
      providesTags: ["Product"],
    }),
    submitReview: builder.mutation({
      query(body){
        return{
          url: "/reviews",
          method:"PUT",
          body,
        }
      },
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review?productId=${productId}`,
      providesTags: ["Product"],
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),

    createProduct: builder.mutation({
      query(body){
        return{
          url: "/admin/products",
          method:"POST",
          body,
        }
      }, 
      invalidatesTags: ["AdminProducts"],
     }),

    updateProduct: builder.mutation({
      query({id,body}){
        return{
          url: `/admin/product/${id}`,
          method:"PUT",
          body,
        }
       }, 
       invalidatesTags: ["Product","AdminProducts"],
      }),

      deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags:["Product","AdminProducts"],
    }),

    getProductReviews: builder.query({
      query: (id) => `/reviews?id=${id}`,
      providesTags: ['Reviews'],
    }),

    deleteReview: builder.mutation({
      query(params) {
        return {
          url: `/admin/reviews`,
          method: "DELETE",
          params: { productId: params.productId, id: params.id },
        };
      },
      invalidatesTags: ["Reviews","Product"],
    }),

    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/product/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },
        invalidatesTags:["Product","AdminProducts"],
    }),

    deleteProductImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/product/${id}/delete_image`, // Match your backend route
          method: "PUT", // Use PUT since we're updating the product's images
          body,
        };
      },
      invalidatesTags: ["Product","AdminProducts"],
    }),
 
 }),
})

export const {
    useGetProductsQuery ,
    useGetProductDetailsQuery,
    useSubmitReviewMutation,
    useCanUserReviewQuery,
    useGetAdminProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImagesMutation,
    useDeleteProductImageMutation,
    useDeleteReviewMutation,
    useGetProductReviewsQuery} 
    = productApi
