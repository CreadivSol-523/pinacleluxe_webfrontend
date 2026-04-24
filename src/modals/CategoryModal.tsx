// hooks/useGetCategoryHandler.ts
import { useNotification } from "@/context/NotificationContext";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoryQuery, useUpdateCategoryMutation } from "@/redux/Category/CategorySlice";
import { Category } from "@/Types/Category/Category";

export const useGetCategoryHandler = () => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetCategoryQuery();

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

export const useCreateCategoryHandler = () => {
   const [CreateCategory, { isLoading }] = useCreateCategoryMutation();
   const { show } = useNotification();

   const handleCreateCategory = async ({ form }: { form: Omit<Category, "_id" | "createdAt"> }) => {
      try {
         const { image, isActive, name, slug, parentId } = form;

         const isEmpty = [image, isActive, name, slug].some((v) => v === "" || v === null || v === undefined);

         if (isEmpty) {
            return show({
               type: "banner",
               variant: "error",
               message: "All fields are required.",
            });
         }

         const formData = new FormData();
         formData.append("name", name);
         formData.append("slug", slug);
         formData.append("isActive", String(isActive));
         if (parentId) formData.append("parentId", parentId);
         formData.append("image", image);

         const res = await CreateCategory({ data: formData });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Category is Not Created! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Category created successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Category is Not Created! Please try again.",
         });
      }
   };

   return { handleCreateCategory, isLoading };
};

export const useUpdateCategoryHandler = () => {
   const [UpdateCategory, { isLoading }] = useUpdateCategoryMutation();
   const { show } = useNotification();

   const handleUpdateCategory = async ({ form, id }: { form: Omit<Category, "_id" | "createdAt">; id: string }) => {
      try {
         const { image, isActive, name, slug, parentId } = form;

         const isEmpty = [image, isActive, name, slug].some((v) => v === "" || v === null || v === undefined);

         if (isEmpty) {
            return show({
               type: "banner",
               variant: "error",
               message: "All fields are required.",
            });
         }

         const formData = new FormData();
         formData.append("name", name);
         formData.append("slug", slug);
         formData.append("isActive", String(isActive));
         if (parentId) formData.append("parentId", parentId);
         formData.append("image", image);

         const res = await UpdateCategory({ data: formData, id });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Category is Not Updated! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Category updated successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Category is Not Created! Please try again.",
         });
      }
   };

   return { handleUpdateCategory, isLoading };
};

export const useDeleteCategoryHandler = () => {
   const [DeleteCategory, { isLoading }] = useDeleteCategoryMutation();
   const { show } = useNotification();

   const handleDeleteCategory = async ({ id }: { id: string }) => {
      try {
         const res = await DeleteCategory({ id });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: (res.error as any)?.data?.message || "Category is Not Deleted! Please try again.",
            });
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Category deleted successfully.",
            });
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Category is Not Deleted! Please try again.",
         });
      }
   };

   return { handleDeleteCategory, isLoading };
};
