import { useNotification } from "@/context/NotificationContext";
import {
   useCreateOrderMutation,
   useGetOrderByIdQuery,
   useGetOrdersQuery,
   useUpdateOrderStatusMutation,
} from "@/redux/Order/OrderSlice";
import { CreateOrderPayload } from "@/Types/Order/OrderType";

// Query hook for all orders
export const useGetOrdersHandler = (params?: {
   page?: number;
   limit?: number;
   status?: string;
   search?: string;
}) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetOrdersQuery(params);

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Query hook for single order by ID
export const useGetOrderByIdHandler = (id: string) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetOrderByIdQuery(
      { id },
      { skip: !id }
   );

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Mutation hook to create an order
export const useCreateOrderHandler = () => {
   const [createOrderMutation, { isLoading }] = useCreateOrderMutation();
   const { show } = useNotification();

   const handleCreateOrder = async (payload: CreateOrderPayload) => {
      try {
         const res = await createOrderMutation({ data: payload }).unwrap();
         return {
            success: true,
            data: res.order || res.data,
            message: res.message,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to create order";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleCreateOrder,
      isLoading,
   };
};

// Mutation hook to update order status
export const useUpdateOrderStatusHandler = () => {
   const [updateStatusMutation, { isLoading }] = useUpdateOrderStatusMutation();
   const { show } = useNotification();

   const handleUpdateOrderStatus = async ({
      id,
      status,
      notes,
   }: {
      id: string;
      status: string;
      notes?: string;
   }) => {
      try {
         const res = await updateStatusMutation({ id, status, notes }).unwrap();
         show({
            type: "banner",
            variant: "success",
            message: "Order status updated successfully",
         });
         return {
            success: true,
            data: res.order || res.data,
         };
      } catch (error: any) {
         const msg = error?.data?.message || error?.message || "Failed to update order status";
         show({
            type: "banner",
            variant: "error",
            message: msg,
         });
         return {
            success: false,
            message: msg,
         };
      }
   };

   return {
      handleUpdateOrderStatus,
      isLoading,
   };
};
