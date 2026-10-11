import { useNotification } from "@/context/NotificationContext";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductFilterQuery, useGetProductQuery, useGetSingleProductQuery, useUpdateProductMutation } from "@/redux/Product/ProductSlice";
import { Product } from "@/Types/Collection/CollectionTypes";

// Create Product API
export const useCreateProductHandler = () => {
   const [CreateProduct, { isLoading }] = useCreateProductMutation();
   const { show } = useNotification();

   const handleCreateProduct = async ({ form, partialFields }: { form: Omit<Product, "_id">; partialFields?: boolean }): Promise<{ success: boolean; data?: unknown }> => {
      try {
         const { variants, gallery, images, stock, badge, categories, description, isVariable, name, slug, subCategory } = form

         const formData = new FormData();

         if (!isVariable) {
            const priceObject = variants?.[0]?.price?.map((v) => ({
               region: v._id,
               price: v.price,
               discountMode: v.discountMode,
               discountValue: v.discountValue,
            }));

            const catArray = subCategory ? [subCategory] : categories ? [categories] : [];

            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("description", description ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", isVariable ? "true" : "false");
            formData.append("badge", badge ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("pricing", JSON.stringify(priceObject));
            formData.append("variants", JSON.stringify([]));
            for (const img of gallery) {
               formData.append("productImages", img);
            }
         }

         if (isVariable) {
            const catArray = subCategory ? [subCategory] : categories ? [categories] : [];

            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("", slug ?? "");
            formData.append("description", description ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", "true");
            formData.append("badge", badge ?? "");

            // remove files from variants
            const cleanVariants = variants.map((v) => ({
               material: v.material,
               price: v.price?.map((p) => ({
                  region: p?._id,
                  price: p.price,
                  discountMode: p.discountMode,
                  discountValue: p.discountValue,
               })),
               colors: v?.colors?.map((c) => ({
                  hex: { code: c.hex.code, colorName: c.hex.colorName },
                  images: c.images,
               })),
            }));

            variants.forEach((v, vi) => {
               v?.colors?.forEach((c, ci) => {
                  c?.images?.forEach((file: any) => {
                     formData.append(`v${vi}_c${ci}`, file);
                  });
               });
            });

            formData.append("variants", JSON.stringify(cleanVariants));

            gallery.forEach((img) => {
               formData.append("productImages", img);
            });
         }

         const res = await CreateProduct({ data: formData });

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Product is Not Created! Please try again.",
            });
            return { success: false };
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Product created successfully.",
            });
            return { success: true, data: res.data };
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Product is Not Created! Please try again.",
         });
         return { success: false };
      }
   };

   return { handleCreateProduct, isLoading };
};

// Update Product API
export const useUpdateProductHandler = () => {
   const [UpdateProduct, { isLoading }] = useUpdateProductMutation();
   const { show } = useNotification();

   const handleUpdateProduct = async ({ form }: { form: Product }): Promise<{ success: boolean; data?: unknown }> => {
      try {
         const { variants, gallery, images, badge, categories, stock, description, isVariable, name, slug, subCategory, _id } = form
         console.log(form, "From API")
         const formData = new FormData();

         if (!isVariable) {
            const priceObject = variants?.[0]?.price?.map((v) => ({
               region: v._id,
               price: v.price,
               discountMode: v.discountMode,
               discountValue: v.discountValue,
            }));

            const catArray = subCategory ? [subCategory] : categories ? [categories] : [];

            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("description", description ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", isVariable ? "true" : "false");
            formData.append("badge", badge ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("pricing", JSON.stringify(priceObject));
            formData.append("variants", JSON.stringify([]));
            for (const img of gallery) {
               formData.append("productImages", img);
            }
         }

         if (isVariable) {
            const catArray = subCategory ? [subCategory] : categories ? [categories] : [];

            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("description", description ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", "true");
            formData.append("badge", badge ?? "");

            // remove files from variants
            const cleanVariants = variants.map((v) => ({
               material: v.material,
               price: v.price?.map((p) => ({
                  region: (p?.region as any)?._id,
                  price: p.price,
                  discountMode: p.discountMode,
                  discountValue: p.discountValue,
               })),
               colors: v?.colors?.map((c) => ({
                  hex: { code: c.hex.code, colorName: c.hex.colorName },
                  images: c.images,
               })),
            }));

            variants.forEach((v, vi) => {
               v?.colors?.forEach((c, ci) => {
                  c?.images?.forEach((file: any) => {
                     formData.append(`v${vi}_c${ci}`, file);
                  });
               });
            });

            formData.append("variants", JSON.stringify(cleanVariants));

            gallery.forEach((img) => {
               formData.append("productImages", img);
            });
         }

         const res = await UpdateProduct({ data: formData, id: _id ?? "" });

         console.log(res);

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Product is Not Created! Please try again.",
            });
            return { success: false };
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Product created successfully.",
            });
            return { success: true, data: res.data };
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Product is Not Created! Please try again.",
         });
         return { success: false };
      }
   };

   return { handleUpdateProduct, isLoading };
};

// Delete Product API
export const useDeleteProductHandler = () => {
   const [DeleteProduct, { isLoading }] = useDeleteProductMutation();
   const { show } = useNotification();

   const handleDeleteProduct = async ({ id }: { id: string }): Promise<{ success: boolean; }> => {
      try {

         if (!id) {
            show({
               type: "banner",
               variant: "error",
               message: "Product ID is required for deletion.",
            });
            return { success: false };
         }

         const res = await DeleteProduct({ id: id ?? "" });

         console.log(res);

         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Product is not deleted! Please try again.",
            });
            return { success: false };
         } else {
            show({
               type: "banner",
               variant: "success",
               message: "Product deleted successfully.",
            });
            return { success: true };
         }
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Product is Not Deleted! Please try again.",
         });
         return { success: false };
      }
   };

   return { handleDeleteProduct, isLoading };
};

// Get Product API
export const useGetProductHandler = ({ limit = 10, page = 1, badge, material, color, category }: { limit: number; page: number, badge?: string, material?: string, color?: string, category?: string }) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetProductQuery({ limit, page, badge, material, color, category });

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Get Single Product API
export const useGetSingleProductHandler = ({ id }: { id: string }) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetSingleProductQuery({ id }, { skip: !id });

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Get Product Filter API
export const useGetProductFilterHandler = (category: string) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetProductFilterQuery({ category });

   return {
      productFilterdata: data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};
