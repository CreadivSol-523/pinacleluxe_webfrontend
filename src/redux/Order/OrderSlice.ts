import { CreateOrderPayload, OrdersResponse, SingleOrderResponse } from "@/Types/Order/OrderType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const OrderSlice = createApi({
   reducerPath: "OrderSlice",
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PORT }),
   tagTypes: ["GetOrder", "CreateOrder", "UpdateOrder"],
   endpoints: (builder) => ({
      getOrders: builder.query<OrdersResponse, { page?: number; limit?: number; status?: string; search?: string; paymentStatus?: string; date?: string } | void>({
         query: (params) => {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append("page", params.page.toString());
            if (params?.limit) queryParams.append("limit", params.limit.toString());
            if (params?.status) queryParams.append("status", params.status);
            if (params?.search) queryParams.append("search", params.search);
            if (params?.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);
            if (params?.date) queryParams.append("date", params.date);

            const query = queryParams.toString();
            return {
               url: `/api/order${query ? `?${query}` : ""}`,
               method: "GET",
            };
         },
         providesTags: ["GetOrder", "CreateOrder", "UpdateOrder"],
      }),

      getOrderById: builder.query<SingleOrderResponse, { id: string }>({
         query: ({ id }) => ({
            url: `/api/order/${id}`,
            method: "GET",
         }),
         providesTags: ["GetOrder"],
      }),

      createOrder: builder.mutation<SingleOrderResponse, { data: CreateOrderPayload }>({
         query: ({ data }) => ({
            url: `/api/order/`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["CreateOrder"],
      }),

      updateOrderStatus: builder.mutation<SingleOrderResponse, { id: string; orderStatus?: string; paymentStatus?: string }>({
         query: ({ id, ...body }) => ({
            url: `/api/order/${id}/status`,
            method: "PATCH",
            body,
         }),
         invalidatesTags: ["UpdateOrder", "GetOrder"],
      }),
   }),
});

export const {
   useGetOrdersQuery,
   useGetOrderByIdQuery,
   useCreateOrderMutation,
   useUpdateOrderStatusMutation,
} = OrderSlice;

export default OrderSlice;
