import { Category } from "@/Types/Category/Category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CategorySlice = createApi({
   reducerPath: "CategorySlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetCategory", "CreateCategory", "UpdateCategory", "DeleteCategory"],
   endpoints: (builder) => ({
      getCategory: builder.query<{ categories: Category[] }, void>({
         query: () => ({
            url: `/api/category/`,
            method: "GET",
         }),
         providesTags: ["GetCategory", "CreateCategory", "UpdateCategory", "DeleteCategory"],
      }),

      createCategory: builder.mutation<{ categories: Category[] }, { data: FormData }>({
         query: ({ data }) => ({
            url: `/api/category/`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateCategory"],
      }),

      updateCategory: builder.mutation<{ categories: Category[] }, { data: FormData; id: string }>({
         query: ({ data, id }) => ({
            url: `/api/category/${id}`,
            method: "PUT",
            body: data,
         }),
         invalidatesTags: ["UpdateCategory"],
      }),

      deleteCategory: builder.mutation<{ message: string }, { id: string }>({
         query: ({ id }) => ({
            url: `/api/category/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["DeleteCategory"],
      }),
   }),
});

export const { useGetCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = CategorySlice;

export default CategorySlice;
