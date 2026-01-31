import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi';
import { logout } from "../features/userSlice"; 
export const authApi = createApi({
reducerPath: 'authApi',
baseQuery: fetchBaseQuery({baseUrl: '/api/v1',credentials: "include",}),
endpoints: (builder) => ({
 
    register: builder.mutation({
      query(body) {
        return{
            url:"/register",
            method:"POST",
            body,
        }
      },
       async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; 
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      }, 
    }),

      login: builder.mutation({
       query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; 
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout()); 
        } catch (error) {
          console.log(error);
        }
      },
    }),

 
 }),
})

export const { useLoginMutation , useRegisterMutation, useLogoutMutation} = authApi
