import { URLParams } from "@/helper/URLParams";
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

      getProduct: builder.query<{ pagination: pagination; products: Product[]; success: boolean }, { limit: number, page: number, badge?: string, material?: string, color?: string, category?: string }>({
         query: ({ limit, page, badge, material, color, category }) => {
            const baseUrl = `/api/product/`;
            const params: Record<string, any> = {
               limit: limit,
               page: page,
               category: category,
               "search[badge]": badge,
               "search[material]": material,
               "search[color]": color,
            }
            const url = URLParams(baseUrl, params);

            return {
               url: url,
               method: "GET",
            }
         },
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct"],
      }),

      getProductFilter: builder.query<{ filters: { badges: string[], colors: string[], materials: string[] }; success: boolean }, { category: string }>({
         query: ({ category }) => ({
            url: `/api/product/filter?category=${category}`,
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
   useGetProductFilterQuery,
   useUpdateProductMutation,
   useDeleteProductMutation,
} = ProductSlice;

export default ProductSlice;
