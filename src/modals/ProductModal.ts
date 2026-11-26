import { useNotification } from "@/context/NotificationContext";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductFilterQuery, useGetProductQuery, useGetSingleProductQuery, useUpdateProductMutation } from "@/redux/Product/ProductSlice";
import { Product } from "@/Types/Collection/CollectionTypes";

type AccessoryItem = NonNullable<Product["accessories"]>[number];

// form mein accessories IDs (string) bhi ho sakti hain ya populated objects
type UpdateProductForm = Omit<Product, "accessories"> & {
   accessories?: Array<string | AccessoryItem>;
};

// Create Product API
export const useCreateProductHandler = () => {
   const [CreateProduct, { isLoading }] = useCreateProductMutation();
   const { show } = useNotification();

   const handleCreateProduct = async ({ form, partialFields }: { form: UpdateProductForm; partialFields?: boolean }): Promise<{ success: boolean; data?: unknown }> => {
      try {
         const { variants, gallery, images, stock, badge, categories, description, isVariable, name, slug, subCategory, accessories } = form

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
            for (const accessory of accessories || []) {
               formData.append("accessories", accessory as any);
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
            for (const accessory of accessories || []) {
               formData.append("accessories", accessory as any);
            }
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
         console.log({ form, res })

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

   // region populated object bhi ho sakta hai ya plain id
   const getRegionId = (p: any): string | undefined => {
      if (p?.region) return typeof p.region === "object" ? p.region._id : p.region;
      return p?._id;
   };

   // accessory populated object ho ya id, dono handle
   const getAccessoryId = (a: any): string => (a && typeof a === "object" ? a._id ?? a : a);

   const handleUpdateProduct = async ({ form }: { form: UpdateProductForm }): Promise<{ success: boolean; data?: unknown }> => {
      try {
         const { variants, gallery, images, badge, categories, stock, description, isVariable, name, slug, subCategory, accessories, _id } = form;

         const formData = new FormData();
         const catArray = subCategory ? [subCategory] : categories ? [categories] : [];

         if (!isVariable) {
            const priceObject = variants?.[0]?.price?.map((p) => ({
               region: getRegionId(p),
               price: p.price,
               discountMode: p.discountMode,
               discountValue: p.discountValue,
            }));

            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("description", description ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", "false");
            formData.append("badge", badge ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("pricing", JSON.stringify(priceObject ?? []));
            formData.append("variants", JSON.stringify([]));

            for (const img of gallery || []) {
               formData.append("productImages", img);
            }
            for (const accessory of accessories || []) {
               formData.append("accessories", getAccessoryId(accessory));
            }
         }

         if (isVariable) {
            formData.append("name", name ?? "");
            formData.append("slug", slug ?? "");
            formData.append("stock", stock ? String(stock) : "0");
            formData.append("description", description ?? "");
            formData.append("thumbnail", images?.[0] ?? "");
            formData.append("categories", JSON.stringify(catArray));
            formData.append("isVariable", "true");
            formData.append("badge", badge ?? "");

            for (const accessory of accessories || []) {
               formData.append("accessories", getAccessoryId(accessory));
            }

            // remove files from variants
            const cleanVariants = (variants || []).map((v) => ({
               material: v.material,
               price: v.price?.map((p) => ({
                  region: p?._id || (p?.region as any)?._id,
                  price: p.price,
                  discountMode: p.discountMode,
                  discountValue: p.discountValue,
               })),
               colors: v?.colors?.map((c) => ({
                  hex: { code: c.hex.code, colorName: c.hex.colorName },
                  images: c.images,
               })),
            }));



            (variants || []).forEach((v, vi) => {
               v?.colors?.forEach((c, ci) => {
                  c?.images?.forEach((file: any) => {
                     formData.append(`v${vi}_c${ci}`, file);
                  });
               });
            });
            console.log(cleanVariants)
            formData.append("variants", JSON.stringify(cleanVariants));

            for (const img of gallery || []) {
               formData.append("productImages", img);
            }
         }

         const res = await UpdateProduct({ data: formData, id: _id ?? "" });

         console.log({ formData, res })
         for (const a of formData) {
            console.log(a)
         }
         if (res.error) {
            show({
               type: "banner",
               variant: "error",
               message: "Product is Not Updated! Please try again.",
            });
            return { success: false };
         }

         show({
            type: "banner",
            variant: "success",
            message: "Product updated successfully.",
         });
         return { success: true, data: res.data };
      } catch (error) {
         show({
            type: "banner",
            variant: "error",
            message: "Product is Not Updated! Please try again.",
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
export const useGetProductHandler = ({ limit = 10, page = 1, badge, material, color, category, regionCode }: { limit: number; page: number, badge?: string, material?: string, color?: string, category?: string, regionCode?: string }) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetProductQuery({ limit, page, badge, material, color, category, regionCode });

   return {
      data,
      isLoading: isLoading || isFetching,
      isError,
      error,
      refetch,
   } as const;
};

// Get Single Product API
export const useGetSingleProductHandler = ({ id, regionCode }: { id: string, regionCode?: string }) => {
   const { data, isLoading, isFetching, isError, error, refetch } = useGetSingleProductQuery({ id, regionCode }, { skip: !id });

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
