import { AdminLoginPayload, AdminLoginResponse } from "@/Types/Admin/AdminType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AdminSlice = createApi({
    reducerPath: "AdminSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_PORT,
        credentials: "include", // cookies send/receive ke liye zaroori
    }),
    tagTypes: ["Admin"],
    endpoints: (builder) => ({
        loginAdmin: builder.mutation<AdminLoginResponse, AdminLoginPayload>({
            query: (data) => ({
                url: `/api/auth/login`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Admin"],
        }),
        logoutAdmin: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: `/api/auth/logout`,
                method: "POST",
            }),
            invalidatesTags: ["Admin"],
        }),
    }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation } = AdminSlice;

export default AdminSlice;