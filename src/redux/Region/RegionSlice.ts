import { Category } from "@/Types/Category/Category";
import { CreateRegionResponse, GetRegionResponse, Region } from "@/Types/Region/Region";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const RegionSlice = createApi({
   reducerPath: "RegionSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetRegion", "CreateRegion", "UpdateRegion", "DeleteRegion"],
   endpoints: (builder) => ({
      getRegion: builder.query<GetRegionResponse, void>({
         query: () => ({
            url: `/api/region/`,
            method: "GET",
         }),
         providesTags: ["GetRegion", "CreateRegion", "UpdateRegion", "DeleteRegion"],
      }),

      createRegion: builder.mutation<{ CreateRegionResponse: CreateRegionResponse }, { data: Omit<Region, "_id"> }>({
         query: ({ data }) => ({
            url: `/api/region/`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateRegion"],
      }),

      updateRegion: builder.mutation<{ CreateRegionResponse: CreateRegionResponse }, { data: Partial<Omit<Region, "_id">>; id: string }>({
         query: ({ data, id }) => ({
            url: `/api/region/${id}`,
            method: "PUT",
            body: data,
         }),
         invalidatesTags: ["UpdateRegion"],
      }),

      deleteRegion: builder.mutation<{ message: string }, { id: string }>({
         query: ({ id }) => ({
            url: `/api/region/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["DeleteRegion"],
      }),
   }),
});

export const { useGetRegionQuery, useCreateRegionMutation, useUpdateRegionMutation, useDeleteRegionMutation } = RegionSlice;

export default RegionSlice;
