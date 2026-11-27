import { URLParams } from "@/helper/URLParams";
import { Category } from "@/Types/Category/Category";
import { Product } from "@/Types/Collection/CollectionTypes";
import { pagination } from "@/Types/Pagination";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ProductSlice = createApi({
   reducerPath: "ProductSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetProduct", "CreateProduct", "UpdateProduct", "DeleteProduct", "BulkDeleteProduct"],
   endpoints: (builder) => ({
      createProduct: builder.mutation<{ success: boolean; product: Product }, { data: FormData }>({
         query: ({ data }) => ({
            url: `/api/product/`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateProduct"],
      }),

      getProduct: builder.query<{ pagination: pagination; products: Product[]; success: boolean }, { limit: number, page: number, badge?: string, material?: string, color?: string, category?: string, regionCode?: string }>({
         query: ({ limit, page, badge, material, color, category, regionCode }) => {
            const baseUrl = `/api/product/`;
            const params: Record<string, any> = {
               limit: limit,
               page: page,
               regionCode: regionCode,
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
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct", "BulkDeleteProduct"],
      }),

      getProductFilter: builder.query<{ filters: { badges: string[], colors: string[], materials: string[] }; success: boolean }, { category: string }>({
         query: ({ category }) => ({
            url: `/api/product/filter?category=${category}`,
            method: "GET",
         }),
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct", "BulkDeleteProduct"],
      }),

      getSingleProduct: builder.query<{ product: Product; success: boolean }, { id: string, regionCode?: string }>({
         query: ({ id, regionCode }) => ({
            url: `/api/product/${id}?regionCode=${regionCode}`,
            method: "GET",
         }),
         providesTags: ["CreateProduct", "DeleteProduct", "UpdateProduct"],
         keepUnusedDataFor: 0,
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

      bulkdeleteProduct: builder.mutation<{ message: string }, { ids: string[] }>({
         query: (ids) => ({
            url: `/api/product/bulk/delete`,
            method: "DELETE",
            body: ids
         }),
         invalidatesTags: ["BulkDeleteProduct"],
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
   useBulkdeleteProductMutation
} = ProductSlice;

export default ProductSlice;
