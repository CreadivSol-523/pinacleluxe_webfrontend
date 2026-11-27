"use client";

import { useRef, useState } from "react";
import { Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import { useGetCategoryHandler } from "@/modals/CategoryModal";
import { useCreateProductHandler, useUpdateProductHandler } from "@/modals/ProductModal";
import { uploadImage, deleteImage, MediaItem } from "@/lib/uploadImages";

export interface ColorVariant {
   hex: { code: string; colorName: string };
   images: MediaItem[];
}

export const BADGES = ["Hot Sellers", "New Arrival", "Pinacle Special", "Archive Sale"];
export const MATERIALS = ["Leather", "Canvas", "Suede", "Satin", "Nylon", "Velvet"];

export type DiscountMode = "static" | "percentage";

export interface RegionPrice {
   region: { _id: string; name: string; currency: string; description: string; isActive: boolean; code: string };
   price: number;
   discountMode?: DiscountMode;
   discountValue?: number;
}

// "accessories" ko Omit kiya hai taake Product type ke saath conflict na ho
export interface ProductFormData extends Omit<Product, "id" | "accessories"> {
   description: string;
   categories: string;
   subCategory: string;
   isVariable: boolean;
   accessories: string[]; // selected accessory product _ids
}

// Single variant — one material/stock + region prices + optional colors
export interface SingleVariantForm {
   material: string;
   price: RegionPrice[];
   colors: ColorVariant[];
}

// Multi variant draft
export interface VariantDraft {
   material: string;
   price: RegionPrice[];
   colors: ColorVariant[];
}

// Draft for building a single RegionPrice entry
export interface RegionPriceDraft {
   region: { _id: string; name: string; currency: string; description: string; isActive: boolean; code: string };
   price: number | undefined;
   discountMode: DiscountMode;
   discountValue: number | undefined;
}

const emptyRegionPriceDraft = (): RegionPriceDraft => ({
   region: { _id: "", name: "", currency: "", description: "", isActive: false, code: "" },
   price: undefined,
   discountMode: "static",
   discountValue: undefined,
});

const emptySingleVariant = (): SingleVariantForm => ({
   material: "",
   price: [],
   colors: [],
});

const emptyVariantDraft = (): VariantDraft => ({
   material: "",
   price: [],
   colors: [],
});

const emptyForm = (): ProductFormData => ({
   name: "",
   slug: "",
   badge: "",
   stock: 0,
   description: "",
   categories: "",
   subCategory: "",
   isVariable: false,
   images: [],
   gallery: [],
   variants: [],
   accessories: [],
});

const emptyColorDraft = (): ColorVariant => ({ hex: { code: "#000000", colorName: "" }, images: [] });

export type FormErrors = Partial<
   Record<keyof ProductFormData, string> & {
      singleMaterial: string;
      singlePrice: string;
      singleStock: string;
      variantMaterial: string;
      variantPrice: string;
      variantStock: string;
      colorHex: string;
      colorName: string;
      colorImage: string;
      regionRegion: string;
      regionPrice: string;
   }
>;

function toSlug(name: string) {
   return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
}

const makeId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

const previewOf = (x: any): string => (typeof x === "string" ? x : x?.preview ?? "");

// Backend ko sirf { url, publicId } (ya purani string URL) jati hai
const toRef = (x: any) => (typeof x === "string" ? x : x?.url ? { url: x.url, publicId: x.publicId ?? "" } : x);

export function useProductForm(onSuccess?: (product: ProductFormData) => void) {
   const [form, setForm] = useState<ProductFormData>(emptyForm());
   const [errors, setErrors] = useState<FormErrors>({});
   const [loading, setLoading] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);

   const [singleVariant, setSingleVariant] = useState<SingleVariantForm>(emptySingleVariant());
   const [variantDraft, setVariantDraft] = useState<VariantDraft>(emptyVariantDraft());

   // Region price draft — shared for both single & multi mode
   const [regionDraft, setRegionDraft] = useState<RegionPriceDraft>(emptyRegionPriceDraft());

   // Color draft — shared for both single & multi mode
   const [colorDraft, setColorDraft] = useState<ColorVariant>(emptyColorDraft());

   // Retry ke liye original File aur cancel ke liye AbortController
   const filesRef = useRef(new Map<string, File>());
   const controllersRef = useRef(new Map<string, AbortController>());

   // Get Category Tree From API
   const { data } = useGetCategoryHandler();
   const CATEGORY_TREE = data?.categories;

   // ── Media helpers ─────────────────────────────────────────────────────────
   // Item ka status/progress wahan update karta hai jahan wo mojood hai (id unique hai)
   const patchItem = (id: string, patch: Partial<MediaItem>) => {
      const map = (list: any[]) => list.map((i) => (i && typeof i !== "string" && i.id === id ? { ...i, ...patch } : i));
      setForm((p) => ({ ...p, images: map(p.images as any[]) as any, gallery: map(p.gallery as any[]) as any }));
      setColorDraft((p) => ({ ...p, images: map(p.images) }));
   };

   const startUpload = (id: string) => {
      const file = filesRef.current.get(id);
      if (!file) return;

      const controller = new AbortController();
      controllersRef.current.set(id, controller);
      patchItem(id, { status: "uploading", progress: 0, error: undefined });

      uploadImage(file, { signal: controller.signal, onProgress: (p) => patchItem(id, { progress: p }) })
         .then((r) => patchItem(id, { status: "done", progress: 100, url: r.url, publicId: r.publicId }))
         .catch((err) => {
            if (err?.name === "AbortError") return; // user ne cross dabaya
            patchItem(id, { status: "error", error: err?.message || "Upload failed" });
         })
         .finally(() => controllersRef.current.delete(id));
   };

   // Cross click: upload chal rahi ho to cancel, ho chuki ho to Cloudinary se delete
   const discard = (item: any) => {
      if (!item || typeof item === "string") return;
      controllersRef.current.get(item.id)?.abort();
      controllersRef.current.delete(item.id);
      filesRef.current.delete(item.id);
      if (typeof item.preview === "string" && item.preview.startsWith("blob:")) URL.revokeObjectURL(item.preview);
      if (item.publicId) deleteImage(item.publicId);
   };

   const colorItems = (): any[] => [
      ...colorDraft.images,
      ...variantDraft.colors.flatMap((c) => c.images),
      ...singleVariant.colors.flatMap((c) => c.images),
      ...form.variants.flatMap((v: any) => (v.colors ?? []).flatMap((c: any) => c.images ?? [])),
   ];

   const allItems = (): any[] => [...(form.images as any[]), ...(form.gallery as any[]), ...colorItems()];

   const mediaBusy = allItems().some((i) => i && typeof i !== "string" && i.status === "uploading");

   const retryUpload = (id: string) => startUpload(id);

   // ── Product-level ─────────────────────────────────────────────────────────
   const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const handleNameChange = (name: string) => {
      setForm((prev) => ({ ...prev, name, slug: toSlug(name) }));
      setErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
   };

   const handleCategoryChange = (catId: string) => {
      setForm((prev) => ({ ...prev, categories: catId, subCategory: "" }));
      setErrors((prev) => ({ ...prev, categories: undefined }));
   };

   const handleVariableToggle = () => {
      colorItems().forEach(discard); // variant/color ki uploaded images hat jati hain
      setForm((prev) => ({ ...prev, isVariable: !prev.isVariable, variants: [] }));
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft(emptyColorDraft());
      setErrors({});
   };

   // ── Accessories ───────────────────────────────────────────────────────────
   const toggleAccessory = (id: string) => {
      setForm((prev) => ({
         ...prev,
         accessories: prev.accessories.includes(id) ? prev.accessories.filter((a) => a !== id) : [...prev.accessories, id],
      }));
   };

   // ── Region price draft setters ────────────────────────────────────────────
   const setRegionDraftField = <K extends keyof RegionPriceDraft>(key: K, value: RegionPriceDraft[K]) => {
      setRegionDraft((prev) => ({
         ...prev,
         [key]: value,
         ...(key === "discountMode" ? { discountValue: undefined } : {}),
      }));
      setErrors((prev) => ({ ...prev, regionRegion: undefined, regionPrice: undefined }));
   };

   // Add region price to target (single or draft)
   const addRegionPrice = (target: "single" | "draft") => {
      const e: FormErrors = {};
      if (!regionDraft?.region?.name?.trim()) e.regionRegion = "Region is required";
      if (!regionDraft.price || regionDraft.price <= 0) e.regionPrice = "Valid price required";
      if (Object.keys(e).length) {
         setErrors((prev) => ({ ...prev, ...e }));
         return;
      }

      const newRegionPrice: RegionPrice = {
         region: { name: regionDraft.region.name?.trim() || "", _id: regionDraft.region._id || "", currency: regionDraft.region.currency || "", description: regionDraft.region.description || "", isActive: regionDraft.region.isActive || false, code: regionDraft.region.code || "" },
         price: regionDraft.price!,
         discountMode: regionDraft.discountMode,
         discountValue: regionDraft.discountValue,
      };

      if (target === "single") {
         if (singleVariant.price.some((r) => r.region?._id === newRegionPrice.region._id)) {
            setErrors((prev) => ({ ...prev, regionRegion: "Region already added" }));
            return;
         }
         setSingleVariant((prev) => ({ ...prev, price: [...prev.price, newRegionPrice] }));
      } else {
         if (variantDraft.price.some((r) => r.region?._id === newRegionPrice.region._id)) {
            setErrors((prev) => ({ ...prev, regionRegion: "Region already added" }));
            return;
         }
         setVariantDraft((prev) => ({ ...prev, price: [...prev.price, newRegionPrice] }));
      }

      setRegionDraft(emptyRegionPriceDraft());
      setErrors((prev) => ({ ...prev, regionRegion: undefined, regionPrice: undefined }));
   };

   // Remove region price
   const removeRegionPrice = (target: "single" | "draft", region: string) => {
      if (target === "single") {
         setSingleVariant((prev) => ({ ...prev, price: prev.price.filter((r) => r.region._id !== region) }));
      } else {
         setVariantDraft((prev) => ({ ...prev, price: prev.price.filter((r) => r.region._id !== region) }));
      }
   };

   // Remove region from committed variant in form
   const removeRegionFromVariant = (material: string, region: string) => {
      setForm((prev) => ({
         ...prev,
         variants: prev.variants.map((v) => (v.material === material ? { ...v, price: v.price.filter((r) => r._id !== region) } : v)),
      }));
   };

   // ── Single variant setters ────────────────────────────────────────────────
   const setSingleField = <K extends keyof SingleVariantForm>(key: K, value: SingleVariantForm[K]) => {
      setSingleVariant((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [`single${key.charAt(0).toUpperCase() + key.slice(1)}`]: undefined }));
   };

   // ── Multi variant draft setters ───────────────────────────────────────────
   const setVariantDraftField = <K extends keyof VariantDraft>(key: K, value: VariantDraft[K]) => {
      setVariantDraft((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [`variant${key.charAt(0).toUpperCase() + key.slice(1)}`]: undefined }));
   };

   // ── Color draft (shared, target-aware) ───────────────────────────────────
   const addColorImage = (url: string, file?: string | File) => {
      if (!url.trim() || !(file instanceof File)) return;

      const item: MediaItem = { id: makeId(), preview: url, status: "uploading", progress: 0 };
      filesRef.current.set(item.id, file);
      setColorDraft((prev) => ({ ...prev, images: [...prev.images, item] }));
      setErrors((prev) => ({ ...prev, colorImage: undefined }));
      startUpload(item.id);
   };

   const removeColorImage = (idx: number) => {
      discard(colorDraft.images[idx]);
      setColorDraft((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
   };

   const addColorToTarget = (target: "single" | "draft") => {
      if (!colorDraft.images.length) {
         setErrors((prev) => ({ ...prev, colorImage: "Add at least one image" }));
         return;
      }
      if (colorDraft.images.some((i) => i.status === "uploading")) {
         setErrors((prev) => ({ ...prev, colorImage: "Images abhi upload ho rahi hain, thora intezar karo" }));
         return;
      }
      if (colorDraft.images.some((i) => i.status === "error")) {
         setErrors((prev) => ({ ...prev, colorImage: "Failed image ko Retry karo ya hata do" }));
         return;
      }

      if (target === "single") {
         if (singleVariant.colors.some((c) => c.hex.code === colorDraft.hex.code)) {
            setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
            return;
         }
         setSingleVariant((prev) => ({ ...prev, colors: [...prev.colors, { ...colorDraft }] }));
      } else {
         if (variantDraft.colors.some((c) => c.hex.code === colorDraft.hex.code)) {
            setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
            return;
         }
         setVariantDraft((prev) => ({ ...prev, colors: [...prev.colors, { ...colorDraft }] }));
      }

      setColorDraft(emptyColorDraft());
      setErrors((prev) => ({ ...prev, colorHex: undefined, colorImage: undefined }));
   };

   const removeSingleColor = (hex: string) => {
      singleVariant.colors.find((c) => c.hex.code === hex)?.images.forEach(discard);
      setSingleVariant((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex.code !== hex) }));
   };

   const removeSingleColorImage = (hex: string, idx: number) => {
      discard(singleVariant.colors.find((c) => c.hex.code === hex)?.images[idx]);
      setSingleVariant((prev) => ({
         ...prev,
         colors: prev.colors.map((c) => (c.hex.code === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   const removeColorFromVariantDraft = (hex: string) => {
      variantDraft.colors.find((c) => c.hex.code === hex)?.images.forEach(discard);
      setVariantDraft((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex.code !== hex) }));
   };

   const removeColorImageFromVariantDraft = (hex: string, idx: number) => {
      discard(variantDraft.colors.find((c) => c.hex.code === hex)?.images[idx]);
      setVariantDraft((prev) => ({
         ...prev,
         colors: prev.colors.map((c) => (c.hex.code === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   // ── Add variant to form (multi mode) ─────────────────────────────────────
   const addVariant = () => {
      const e: FormErrors = {};
      if (!variantDraft.material) e.variantMaterial = "Select a material";
      if (!variantDraft.price.length) e.variantPrice = "Add at least one region price";
      if (!variantDraft.colors.length) e.colorImage = "Add at least one color image";
      if (Object.keys(e).length) {
         setErrors((prev) => ({ ...prev, ...e }));
         return;
      }
      if (form.variants.some((v) => v.material === variantDraft.material)) {
         setErrors((prev) => ({ ...prev, variantMaterial: "Variant with this material already exists" }));
         return;
      }

      const newVariant: VariantSchema = {
         material: variantDraft.material,
         price: variantDraft.price.map((r) => ({
            _id: r.region._id,
            region: r.region.name,
            price: r.price,
            discountMode: r.discountMode,
            discountValue: r.discountValue,
            code: r.region.code,
         })),
         colors: variantDraft.colors.map((c) => ({ hex: { code: c.hex.code, colorName: c.hex.colorName }, images: c.images as any })),
      };

      setForm((prev) => ({ ...prev, variants: [...prev.variants, newVariant] }));
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft(emptyColorDraft());
      setErrors((prev) => ({ ...prev, variantMaterial: undefined, variantPrice: undefined, variantStock: undefined }));
   };

   const removeVariant = (material: string) => {
      form.variants.find((v) => v.material === material)?.colors?.forEach((c: any) => c.images?.forEach(discard));
      setForm((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.material !== material) }));
   };

   const removeColorFromVariant = (material: string, hex: string) => {
      form.variants
         .find((v) => v.material === material)
         ?.colors?.find((c: any) => c.hex.code === hex)
         ?.images?.forEach(discard);
      setForm((prev) => ({
         ...prev,
         variants: prev.variants.map((v) => (v.material === material ? { ...v, colors: v.colors?.filter((c) => c.hex.code !== hex) } : v)),
      }));
   };

   const removeColorVariantImage = (material: string, hex: string, idx: number) => {
      discard(
         form.variants
            .find((v) => v.material === material)
            ?.colors?.find((c: any) => c.hex.code === hex)?.images?.[idx]
      );
      setForm((prev) => ({
         ...prev,
         variants: prev.variants.map((v) => (v.material === material ? { ...v, colors: v.colors?.map((c) => (c.hex.code === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)) } : v)),
      }));
   };

   // ── Product images (select hote hi upload) ───────────────────────────────
   const addImage = (key: "images" | "gallery", url: string, file?: File) => {
      if (!url.trim() || !file) return;

      const item: MediaItem = { id: makeId(), preview: url, status: "uploading", progress: 0 };
      filesRef.current.set(item.id, file);

      if (key === "images") {
         // Main image sirf ek hoti hai: purani ko cancel/delete karo
         (form.images as any[]).forEach(discard);
         setForm((prev) => ({ ...prev, images: [item] as any }));
      } else {
         setForm((prev) => ({ ...prev, gallery: [...(prev.gallery as any[]), item] as any }));
      }

      setErrors((prev) => ({ ...prev, [key]: undefined }));
      startUpload(item.id);
   };

   const removeImage = (key: "images" | "gallery", idx: number) => {
      discard((form[key] as any[])[idx]);
      setForm((prev) => ({ ...prev, [key]: (prev[key] as any[]).filter((_, i) => i !== idx) as any }));
   };

   // ── Validate ──────────────────────────────────────────────────────────────
   const validate = (): boolean => {
      const e: FormErrors = {};
      if (!form.name?.trim()) e.name = "Name is required";
      if (!form.slug?.trim()) e.slug = "Slug is required";
      if (!form.stock) e.stock = "Stock is required";
      if (!form.categories) e.categories = "Category is required";
      if (!form.images.length) e.images = "Add at least one image";
      if (!form.isVariable) {
         if (!singleVariant.price.length) e.singlePrice = "Add at least one region price";
      } else {
         if (!form.variants.length) e.variants = "Add at least one variant";
      }
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── Handle API Calls ────────────────────────────────────────────────────────
   const { handleCreateProduct } = useCreateProductHandler();
   const { handleUpdateProduct } = useUpdateProductHandler();

   // ── Submit ────────────────────────────────────────────────────────────────
   const handleSubmit = async ({ type }: { type: "create" | "update" }) => {
      setSubmitError(null);
      if (!validate()) return;

      // finalForm mein form ke saath accessories (array of ids) bhi shamil hain
      let finalForm: any = { ...form, accessories: form.accessories };
      if (!form.isVariable) {
         finalForm.variants = [
            {
               material: singleVariant.material,
               price: singleVariant.price.map((r) => ({ _id: r.region._id, region: r.region.name, price: r.price, discountMode: r.discountMode, discountValue: r.discountValue, code: r.region.code })),
               colors: singleVariant.colors.map((c) => ({ hex: { code: c.hex.code, colorName: c.hex.colorName }, images: c.images })),
            },
         ];
      }

      // Jo images product ke saath ja rahi hain wo sab upload ho chuki hon
      const outgoing: any[] = [...finalForm.images, ...finalForm.gallery, ...finalForm.variants.flatMap((v: any) => (v.colors ?? []).flatMap((c: any) => c.images ?? []))];
      if (outgoing.some((i) => i && typeof i !== "string" && i.status === "uploading")) {
         setSubmitError("Images abhi upload ho rahi hain, thora intezar karo");
         return;
      }
      if (outgoing.some((i) => i && typeof i !== "string" && i.status === "error")) {
         setSubmitError("Kuch images upload nahi hui, Retry karo ya hata do");
         return;
      }

      setLoading(true);
      try {
         // MediaItem -> { url, publicId }
         finalForm = {
            ...finalForm,
            images: finalForm.images.map(toRef),
            gallery: finalForm.gallery.map(toRef),
            variants: finalForm.variants.map((v: any) => ({
               ...v,
               colors: v.colors?.map((c: any) => ({ ...c, images: c.images.map(toRef) })),
            })),
         };

         const res: any = type === "create" ? await handleCreateProduct({ form: finalForm }) : await handleUpdateProduct({ form: finalForm });

         // Fail hone par form reset mat karo, warna user ka saara data chala jayega
         if (res && res.success === false) return;

         // Jo draft images save nahi huin (adhoore color/variant draft) unhe Cloudinary se hata do
         [...colorDraft.images, ...variantDraft.colors.flatMap((c) => c.images)].forEach(discard);

         onSuccess?.(finalForm);
         setForm(emptyForm());
         setSingleVariant(emptySingleVariant());
         setVariantDraft(emptyVariantDraft());
         setColorDraft(emptyColorDraft());
      } catch (err) {
         setSubmitError(err instanceof Error ? err.message : "Something went wrong, please try again");
      } finally {
         setLoading(false);
      }
   };

   // Modal band/cancel: in-flight uploads cancel aur uploaded images Cloudinary se delete
   const reset = () => {
      allItems().forEach(discard);
      setForm(emptyForm());
      setErrors({});
      setSubmitError(null);
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft(emptyColorDraft());
   };

   const subCategories = CATEGORY_TREE?.find((c) => c?._id === form.categories)?.children ?? [];

   // Purane code ke liye read-only previews (ab form items se nikalte hain)
   const imageURLs = {
      images: (form.images as any[]).map(previewOf),
      gallery: (form.gallery as any[]).map(previewOf),
      colorImages: colorDraft.images.map(previewOf),
   };
   const showColorDraft = { hex: colorDraft.hex, images: colorDraft.images.map(previewOf) };

   return {
      form,
      setForm,
      errors,
      loading,
      mediaBusy,
      submitError,
      setField,
      handleNameChange,
      handleCategoryChange,
      handleVariableToggle,
      addImage,
      retryUpload,
      imageURLs,
      removeImage,
      // single
      singleVariant,
      setSingleField,
      removeSingleColor,
      removeSingleColorImage,
      // multi
      variantDraft,
      setVariantDraftField,
      addVariant,
      removeVariant,
      removeColorFromVariant,
      removeColorVariantImage,
      removeRegionFromVariant,
      // region price draft (shared)
      regionDraft,
      setRegionDraftField,
      addRegionPrice,
      removeRegionPrice,
      // color draft (shared)
      colorDraft,
      setColorDraft,
      showColorDraft,
      addColorImage,
      removeColorImage,
      addColorToTarget,
      removeColorFromVariantDraft,
      removeColorImageFromVariantDraft,
      // accessories
      toggleAccessory,
      // submit
      handleSubmit,
      reset,
      subCategories,
      BADGES,
      MATERIALS,
      CATEGORY_TREE,
   };
}