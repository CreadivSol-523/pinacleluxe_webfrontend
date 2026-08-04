import { Category } from "@/Types/Category/Category";
import { Product } from "@/Types/Collection/CollectionTypes";
import { pagination } from "@/Types/Pagination";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ProductSlice = createApi({
   reducerPath: "ProductSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetProduct", "CreateProduct", "UpdateProduct", "DeleteProduct"],
   endpoints: (builder) => ({
      createProduct: builder.mutation<{ success: boolean; product: Product }, { data: FormData }>({
         query: ({ data }) => ({
            url: `/api/product/`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateProduct"],
      }),

      getProduct: builder.query<{ pagination: pagination; products: Product[]; success: boolean }, { limit: number, page: number }>({
         query: ({ limit, page }) => ({
            url: `/api/product/?limit=${limit}&page=${page}`,
            method: "GET",
         }),
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct"],
      }),

      getSingleProduct: builder.query<{ product: Product; success: boolean }, { id: string }>({
         query: ({ id }) => ({
            url: `/api/product/${id}`,
            method: "GET",
         }),
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct"],
      }),

      updateProduct: builder.mutation<{ success: true, product: Product }, { id: string, data: FormData }>({
         query: ({ id, data }) => ({
            url: `/api/product/${id}`,
            method: "PUT",
            body: data,
         }),
         invalidatesTags: ["UpdateProduct"],
      }),

      deleteProduct: builder.mutation<{ message: string }, { id: string }>({
         query: ({ id }) => ({
            url: `/api/product/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["DeleteProduct"],
      }),
   }),
});

export const {
   useCreateProductMutation,
   useGetProductQuery,
   useGetSingleProductQuery,
   useUpdateProductMutation,
   useDeleteProductMutation,
} = ProductSlice;

export default ProductSlice;
