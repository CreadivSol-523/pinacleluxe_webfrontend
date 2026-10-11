import { Category } from "@/Types/Category/Category";
import { CreateRegionResponse, GetRegionResponse, Region } from "@/Types/Region/Region";
import { CreateWebSectionsResponse, GetWebSectionsResponse, HeroConfig, MediaSectionConfig, SalesBannerConfig, TopBarConfig } from "@/Types/WebSection/WebSection";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const WebSectionSlice = createApi({
   reducerPath: "WebSectionSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetWebSections", "CreateWebSections", "UpdateWebSections", "DeleteWebSections"],
   endpoints: (builder) => ({
      getWebSections: builder.query<GetWebSectionsResponse, void>({
         query: () => ({
            url: `/api/webSection/`,
            method: "GET",
         }),
         providesTags: ["GetWebSections", "CreateWebSections", "UpdateWebSections", "DeleteWebSections"],
      }),

      getSingleWebSections: builder.query<{ success: boolean; data: TopBarConfig | SalesBannerConfig | HeroConfig | MediaSectionConfig }, { type: string }>({
         query: ({ type }) => ({
            url: `/api/webSection/${type}`,
            method: "GET",
         }),
         providesTags: ["GetWebSections", "CreateWebSections", "UpdateWebSections", "DeleteWebSections"],
      }),

      createWebSections: builder.mutation<{ CreateWebSectionsResponse: CreateWebSectionsResponse }, { type: string, data: FormData }>({
         query: ({ data, type }) => ({
            url: `/api/webSection/${type}`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateWebSections"],
      }),

      updateWebSections: builder.mutation<{ CreateWebSectionsResponse: CreateWebSectionsResponse }, { type: string, data: FormData }>({
         query: ({ data, type }) => ({
            url: `/api/webSection/${type}`,
            method: "PUT",
            body: data,
         }),
         invalidatesTags: ["UpdateWebSections"],
      }),

      deleteWebSections: builder.mutation<{ message: string }, { type: string }>({
         query: ({ type }) => ({
            url: `/api/webSection/${type}`,
            method: "DELETE",
         }),
         invalidatesTags: ["DeleteWebSections"],
      }),
   }),
});

export const { useCreateWebSectionsMutation, useGetSingleWebSectionsQuery, useGetWebSectionsQuery, useUpdateWebSectionsMutation, useDeleteWebSectionsMutation } = WebSectionSlice;

export default WebSectionSlice;
