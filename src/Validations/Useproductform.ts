"use client";

import { useState } from "react";
import { Product, VariantSchema, colorVariants } from "@/Types/Collection/CollectionTypes";
import { useGetCategoryHandler } from "@/modals/CategoryModal";
import { useCreateProductHandler, useUpdateProductHandler } from "@/modals/ProductModal";

export interface ColorVariant {
   hex: { code: string; colorName: string };
   images: (string | File)[];
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

export interface ProductFormData extends Omit<Product, "id"> {
   description: string;
   categories: string;
   subCategory: string;
   isVariable: boolean;
}

// Single variant — one material/stock + region prices + optional colors
export interface SingleVariantForm {
   material: string;
   price: RegionPrice[];
   // stock: number | undefined;
   colors: ColorVariant[];
}

// Multi variant draft
export interface VariantDraft {
   material: string;
   price: RegionPrice[];
   // stock: number | undefined;
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
   // stock: undefined,
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
});

const emptyImageURLs = (): {
   images: string[];
   gallery: string[];
   colorImages: string[]; // sab colors ke images
} => ({ images: [], gallery: [], colorImages: [] });

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

export function useProductForm(onSuccess?: (product: ProductFormData) => void) {
   const [form, setForm] = useState<ProductFormData>(emptyForm());
   const [errors, setErrors] = useState<FormErrors>({});
   const [loading, setLoading] = useState(false);
   const [imageURLs, setImageURLs] = useState<{
      images: string[];
      gallery: string[];
      colorImages: string[]; // sab colors ke images
   }>(emptyImageURLs());

   const [singleVariant, setSingleVariant] = useState<SingleVariantForm>(emptySingleVariant());
   const [variantDraft, setVariantDraft] = useState<VariantDraft>(emptyVariantDraft());

   // Region price draft — shared for both single & multi mode
   const [regionDraft, setRegionDraft] = useState<RegionPriceDraft>(emptyRegionPriceDraft());

   // Color draft — shared for both single & multi mode
   const [colorDraft, setColorDraft] = useState<ColorVariant>({
      hex: { code: "#000000", colorName: "" },
      images: [],
   });

   const [showColorDraft, setShowColorDraft] = useState<{ hex: { code: string; colorName: string }; images?: string[] }>({
      hex: { code: "#000000", colorName: "" },
      images: [],
   });

   // Get Category Tree From API
   const { data, error, isError, isLoading, refetch } = useGetCategoryHandler();

   const CATEGORY_TREE = data?.categories;

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
      setForm((prev) => ({ ...prev, isVariable: !prev.isVariable, variants: [] }));
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setShowColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setErrors({});
   };

   // ── Region price draft setters ────────────────────────────────────────────
   const setRegionDraftField = <K extends keyof RegionPriceDraft>(key: K, value: RegionPriceDraft[K]) => {
      setRegionDraft((prev) => ({
         ...prev,
         [key]: value,
         // reset discountedValue when mode changes
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
   const addColorImage = (url: string, file: string | File) => {
      if (!url.trim()) return;
      setColorDraft((prev) => ({ ...prev, images: [...prev.images, file] }));
      setShowColorDraft((prev) => ({ ...prev, images: [...(prev?.images as any), url.trim()] }));
      setImageURLs((prev) => ({ ...prev, colorImages: [...prev.colorImages, url.trim()] }));
   };

   const removeColorImage = (idx: number) => {
      setColorDraft((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
      setShowColorDraft((prev) => ({ ...prev, images: prev?.images?.filter((_, i) => i !== idx) }));
      setImageURLs((prev) => ({ ...prev, colorImages: prev.colorImages.filter((_, i) => i !== idx) }));
   };

   const addColorToTarget = (target: "single" | "draft") => {
      if (!colorDraft.images.length) {
         setErrors((prev) => ({ ...prev, colorImage: "Add at least one image" }));
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

      setColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setShowColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setErrors((prev) => ({ ...prev, colorHex: undefined, colorImage: undefined }));
   };

   const removeSingleColor = (hex: string) => {
      setSingleVariant((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex.code !== hex) }));
   };

   const removeSingleColorImage = (hex: string, idx: number) => {
      setSingleVariant((prev) => ({
         ...prev,
         colors: prev.colors.map((c) => (c.hex.code === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   const removeColorFromVariantDraft = (hex: string) => {
      setVariantDraft((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex.code !== hex) }));
   };

   const removeColorImageFromVariantDraft = (hex: string, idx: number) => {
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
      // if (!variantDraft.colors.some(ch => ch.hex?.find(cn => cn.))) e.colorName = "Add color Name";
      // if (!variantDraft.colors.length) e.colorHex = "Add color hex";
      // if (variantDraft.stock === undefined || variantDraft.stock < 0) e.variantStock = "Stock is required";
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
            _id: r.region._id, // ✅ yeh hai
            region: r.region.name,
            price: r.price,
            discountMode: r.discountMode,
            discountValue: r.discountValue,
            code: r.region.code,
         })),
         // stock: variantDraft.stock,
         colors: variantDraft.colors.map((c) => ({ hex: { code: c.hex.code, colorName: c.hex.colorName }, images: c.images })),
      };

      setForm((prev) => ({ ...prev, variants: [...prev.variants, newVariant] }));
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setShowColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setErrors((prev) => ({ ...prev, variantMaterial: undefined, variantPrice: undefined, variantStock: undefined }));
   };

   const removeVariant = (material: string) => {
      setForm((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.material !== material) }));
   };

   const removeColorFromVariant = (material: string, hex: string) => {
      setForm((prev) => ({
         ...prev,
         variants: prev.variants.map((v) => (v.material === material ? { ...v, colors: v.colors?.filter((c) => c.hex.code !== hex) } : v)),
      }));
   };

   const removeColorVariantImage = (material: string, hex: string, idx: number) => {
      setForm((prev) => ({
         ...prev,
         variants: prev.variants.map((v) => (v.material === material ? { ...v, colors: v.colors?.map((c) => (c.hex.code === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)) } : v)),
      }));
   };

   // ── Product images ────────────────────────────────────────────────────────
   const addImage = (key: "images" | "gallery", url: string, file?: File) => {
      if (!url.trim() || !file) return;

      setForm((prev) => ({ ...prev, [key]: key === "images" ? [file] : [...(prev[key] as File[]), file] }));
      setImageURLs((prev) => ({ ...prev, [key]: key === "images" ? [url.trim()] : [...prev[key], url.trim()] }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const removeImage = (key: "images" | "gallery", idx: number) => {
      setForm((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }));
      setImageURLs((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }));
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
         // if (singleVariant.stock === undefined || singleVariant.stock < 0) e.singleStock = "Stock is required";
      } else {
         if (!form.variants.length) e.variants = "Add at least one variant";
      }
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── Handle API Calls ────────────────────────────────────────────────────────

   // Create Product API
   const { handleCreateProduct, isLoading: createProductLoading } = useCreateProductHandler();

   // Update Product API
   const { handleUpdateProduct, isLoading: updateProductLoading } = useUpdateProductHandler();

   // ── Submit ────────────────────────────────────────────────────────────────
   const handleSubmit = async ({ type }: { type: "create" | "update" }) => {
      if (!validate()) return;
      setLoading(true);
      let finalForm = { ...form };

      if (!form.isVariable) {
         finalForm.variants = [
            {
               material: singleVariant.material,
               price: singleVariant.price.map((r) => ({ _id: r.region._id, region: r.region.name, price: r.price, discountMode: r.discountMode, discountValue: r.discountValue, code: r.region.code })),
               colors: singleVariant.colors.map((c) => ({ hex: { code: c.hex.code, colorName: c.hex.colorName }, images: c.images })),
            },
         ];
      }
      try {

         if (type === "create") {
            await handleCreateProduct({ form: finalForm });
         } else {
            await handleUpdateProduct({ form: finalForm });
         }
         onSuccess?.(finalForm);
         setForm(emptyForm());
         setSingleVariant(emptySingleVariant());
         setImageURLs(emptyImageURLs());
      } finally {
         setLoading(false);
      }
   };

   const reset = () => {
      setForm(emptyForm());
      setErrors({});
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setRegionDraft(emptyRegionPriceDraft());
      setColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
      setShowColorDraft({ hex: { code: "#000000", colorName: "" }, images: [] });
   };

   const subCategories = CATEGORY_TREE?.find((c) => c?._id === form.categories)?.children ?? [];

   return {
      form,
      setForm,
      errors,
      loading,
      setField,
      handleNameChange,
      handleCategoryChange,
      handleVariableToggle,
      addImage,
      imageURLs,
      setImageURLs,
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
      setShowColorDraft,
      showColorDraft,
      addColorImage,
      removeColorImage,
      addColorToTarget,
      removeColorFromVariantDraft,
      removeColorImageFromVariantDraft,
      // submit
      handleSubmit,
      reset,
      subCategories,
      BADGES,
      MATERIALS,
      CATEGORY_TREE,
   };
}