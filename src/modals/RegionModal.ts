import { useNotification } from "@/context/NotificationContext";
import { useCreateRegionMutation, useDeleteRegionMutation, useGetRegionQuery, useUpdateRegionMutation } from "@/redux/Region/RegionSlice";
import { Region } from "@/Types/Region/Region";

// Create Region API
export const useCreateRegionHandler = () => {
   const [CreateRegion, { isLoading }] = useCreateRegionMutation();
   const { show } = useNotification();

   const handleCreateRegion = async ({ form, partialFields }: { form: Omit<Region, "_id">; partialFields?: boolean }) => {
      try {
         const { code, currency, description, isActive, name } = form;

         const isEmpty = [code, currency, description, isActive, name].some((v) => v === "" || v === null || v === undefined);

         if (isEmpty && !partialFields) {
            return show({
               type: "banner",
               variant: "error",
               message: "All fields are required.",
            });
         }

         const res = await CreateRegion({ data: form });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Region is Not Created! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Region created successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Region is Not Created! Please try again.",
         });
      }
   };

   return { handleCreateRegion, isLoading };
};

// Update Region API
export const useUpdateRegionHandler = () => {
   const [UpdateRegion, { isLoading }] = useUpdateRegionMutation();
   const { show } = useNotification();

   const handleUpdateCategory = async ({ form, id, partialFields = false }: { form: Partial<Omit<Region, "_id">>; id: string; partialFields?: boolean }) => {
      try {
         const { code, isActive, name, currency, description } = form;

         const isEmpty = [code, isActive, name, currency, description].some((v) => v === "" || v === null || v === undefined);

         if (isEmpty && !partialFields) {
            return show({
               type: "banner",
               variant: "error",
               message: "All fields are required.",
            });
         }

         const res = await UpdateRegion({ data: form, id });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Region is Not Updated! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Region updated successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Region is Not Updated! Please try again.",
         });
      }
   };

   return { handleUpdateCategory, isLoading };
};

// Get Region API
export const useGetRegionHandler = () => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetRegionQuery();

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Delete Region API
export const useDeleteRegionHandler = () => {
   const [DeleteRegion, { isLoading }] = useDeleteRegionMutation();
   const { show } = useNotification();

   const handleDeleteRegion = async ({ id }: { id: string }) => {
      try {
         const res = await DeleteRegion({ id });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: (res.error as any)?.data?.message || "Region is Not Deleted! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Region deleted successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Region is Not Deleted! Please try again.",
         });
      }
   };

   return { handleDeleteRegion, isLoading };
};
