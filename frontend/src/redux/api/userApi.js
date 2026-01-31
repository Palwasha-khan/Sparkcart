import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUser, setIsAuthenticated,logout } from "../features/userSlice"; 
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include", // 🔥 IMPORTANT for cookies
  }),
  tagTypes:["User"],
  endpoints: (builder) => ({
      getMe: builder.query({
      query: () => "/me",
      transformResponse: (res) => res.user,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
        } catch (err) {
          console.log(err);
          dispatch(logout());
        }
      },
      providesTags: ["User"],
      }),

      updateProfile: builder.mutation({
        query(body) {
          return{
            url:"/me/update",
            method:"PUT",
            body,  
          }
       },
       invalidatesTags:["User"],
    })

  }),
});

export const { useGetMeQuery, useUpdateProfileMutation} = userApi
