"use client";

import { useState } from "react";
import { Product, VariantSchema, colorVariants } from "@/Types/Collection/CollectionTypes";

export interface ColorVariant {
   hex: string;
   images: string[];
}

export const BADGES = ["Hot Sellers", "New Arrival", "Pinacle Special", "Archive Sale"];
export const MATERIALS = ["Leather", "Canvas", "Suede", "Satin", "Nylon", "Velvet"];

export const CATEGORY_TREE = [
   {
      id: "cat_totes",
      name: "Totes",
      children: [
         { id: "cat_leather_totes", name: "Leather Totes" },
         { id: "cat_canvas_totes", name: "Canvas Totes" },
      ],
   },
   { id: "cat_shoulder", name: "Shoulder Bags", children: [{ id: "cat_mini_shoulder", name: "Mini Shoulder" }] },
   { id: "cat_crossbody", name: "Crossbody", children: [] },
   { id: "cat_hobo", name: "Hobo", children: [] },
   { id: "cat_clutch", name: "Clutch", children: [] },
   {
      id: "cat_small",
      name: "Small Leather Goods",
      children: [
         { id: "cat_wallets", name: "Wallets" },
         { id: "cat_cardholders", name: "Card Holders" },
      ],
   },
];

export type DiscountMode = "static" | "percentage";

export interface ProductFormData extends Omit<Product, "id"> {
   description: string;
   category: string;
   subCategory: string;
   isVariable: boolean;
}

// Single variant — one material/price/stock/discount + optional colors
export interface SingleVariantForm {
   material: string;
   price: number | undefined;
   stock: number | undefined;
   discount: number | undefined;
   discountMode: DiscountMode;
   discountPrice: number | undefined;
   colors: ColorVariant[];
}

// Multi variant draft — same as single but gets pushed to VariantSchema[]
export interface VariantDraft {
   material: string;
   price: number | undefined;
   stock: number | undefined;
   discount: number | undefined;
   discountMode: DiscountMode;
   discountPrice: number | undefined;
   colors: ColorVariant[];
}

const emptySingleVariant = (): SingleVariantForm => ({
   material: "",
   price: undefined,
   stock: undefined,
   discount: undefined,
   discountMode: "static",
   discountPrice: undefined,
   colors: [],
});

const emptyVariantDraft = (): VariantDraft => ({
   material: "",
   price: undefined,
   stock: undefined,
   discount: undefined,
   discountMode: "static",
   discountPrice: undefined,
   colors: [],
});

const emptyForm = (): ProductFormData => ({
   name: "",
   slug: "",
   badge: "",
   description: "",
   category: "",
   subCategory: "",
   isVariable: false,
   images: [],
   gallery: [],
   VariantSchema: [],
});

export type FormErrors = Partial<
   Record<keyof ProductFormData, string> & {
      singleMaterial: string;
      singlePrice: string;
      singleStock: string;
      variantMaterial: string;
      variantPrice: string;
      variantStock: string;
      colorHex: string;
      colorImage: string;
   }
>;

function toSlug(name: string) {
   return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
}

function calcDiscountPrice(price: number | undefined, discount: number | undefined, mode: DiscountMode): number | undefined {
   if (!price || discount === undefined) return undefined;
   return mode === "percentage" ? Math.round(price - (price * discount) / 100) : Math.round(price - discount);
}

export function useProductForm(onSuccess?: (product: ProductFormData) => void) {
   const [form, setForm] = useState<ProductFormData>(emptyForm());
   const [errors, setErrors] = useState<FormErrors>({});
   const [loading, setLoading] = useState(false);

   const [singleVariant, setSingleVariant] = useState<SingleVariantForm>(emptySingleVariant());
   const [variantDraft, setVariantDraft] = useState<VariantDraft>(emptyVariantDraft());

   // colorDraft is shared — used for both single & multi mode
   const [colorDraft, setColorDraft] = useState<ColorVariant>({ hex: "#000000", images: [] });

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
      setForm((prev) => ({ ...prev, category: catId, subCategory: "" }));
      setErrors((prev) => ({ ...prev, category: undefined }));
   };

   const handleVariableToggle = () => {
      setForm((prev) => ({ ...prev, isVariable: !prev.isVariable, VariantSchema: [] }));
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setColorDraft({ hex: "#000000", images: [] });
      setErrors({});
   };

   // ── Single variant setters ────────────────────────────────────────────────
   const setSingleField = <K extends keyof SingleVariantForm>(key: K, value: SingleVariantForm[K]) => {
      setSingleVariant((prev) => {
         const updated = { ...prev, [key]: value };
         if (key === "price" || key === "discount" || key === "discountMode") {
            updated.discountPrice = calcDiscountPrice(key === "price" ? (value as number) : prev.price, key === "discount" ? (value as number) : prev.discount, key === "discountMode" ? (value as DiscountMode) : prev.discountMode);
         }
         return updated;
      });
      setErrors((prev) => ({ ...prev, [`single${key.charAt(0).toUpperCase() + key.slice(1)}`]: undefined }));
   };

   const handleSingleDiscountModeChange = (mode: DiscountMode) => {
      setSingleVariant((prev) => ({ ...prev, discountMode: mode, discount: undefined, discountPrice: undefined }));
   };

   // ── Multi variant draft setters ───────────────────────────────────────────
   const setVariantDraftField = <K extends keyof VariantDraft>(key: K, value: VariantDraft[K]) => {
      setVariantDraft((prev) => {
         const updated = { ...prev, [key]: value };
         if (key === "price" || key === "discount" || key === "discountMode") {
            updated.discountPrice = calcDiscountPrice(key === "price" ? (value as number) : prev.price, key === "discount" ? (value as number) : prev.discount, key === "discountMode" ? (value as DiscountMode) : prev.discountMode);
         }
         return updated;
      });
      setErrors((prev) => ({ ...prev, [`variant${key.charAt(0).toUpperCase() + key.slice(1)}`]: undefined }));
   };

   const handleVariantDiscountModeChange = (mode: DiscountMode) => {
      setVariantDraft((prev) => ({ ...prev, discountMode: mode, discount: undefined, discountPrice: undefined }));
   };

   // ── Color draft (shared, target-aware) ───────────────────────────────────
   const addColorImage = (url: string) => {
      if (!url.trim()) return;
      setColorDraft((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
   };

   const removeColorImage = (idx: number) => {
      setColorDraft((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
   };

   const addColorToTarget = (target: "single" | "draft") => {
      if (!colorDraft.images.length) {
         setErrors((prev) => ({ ...prev, colorImage: "Add at least one image" }));
         return;
      }

      if (target === "single") {
         if (singleVariant.colors.some((c) => c.hex === colorDraft.hex)) {
            setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
            return;
         }
         setSingleVariant((prev) => ({ ...prev, colors: [...prev.colors, { ...colorDraft }] }));
      } else {
         if (variantDraft.colors.some((c) => c.hex === colorDraft.hex)) {
            setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
            return;
         }
         setVariantDraft((prev) => ({ ...prev, colors: [...prev.colors, { ...colorDraft }] }));
      }

      setColorDraft({ hex: "#000000", images: [] });
      setErrors((prev) => ({ ...prev, colorHex: undefined, colorImage: undefined }));
   };

   // Remove color from single variant
   const removeSingleColor = (hex: string) => {
      setSingleVariant((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex !== hex) }));
   };

   const removeSingleColorImage = (hex: string, idx: number) => {
      setSingleVariant((prev) => ({
         ...prev,
         colors: prev.colors.map((c) => (c.hex === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   // Remove color from variant draft
   const removeColorFromVariantDraft = (hex: string) => {
      setVariantDraft((prev) => ({ ...prev, colors: prev.colors.filter((c) => c.hex !== hex) }));
   };

   const removeColorImageFromVariantDraft = (hex: string, idx: number) => {
      setVariantDraft((prev) => ({
         ...prev,
         colors: prev.colors.map((c) => (c.hex === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   // ── Add variant to form (multi mode) ─────────────────────────────────────
   const addVariant = () => {
      const e: FormErrors = {};
      if (!variantDraft.material) e.variantMaterial = "Select a material";
      if (!variantDraft.price || variantDraft.price <= 0) e.variantPrice = "Valid price required";
      if (variantDraft.stock === undefined || variantDraft.stock < 0) e.variantStock = "Stock is required";
      if (Object.keys(e).length) {
         setErrors((prev) => ({ ...prev, ...e }));
         return;
      }
      if (form.VariantSchema.some((v) => v.material === variantDraft.material)) {
         setErrors((prev) => ({ ...prev, variantMaterial: "Variant with this material already exists" }));
         return;
      }
      const newVariant: VariantSchema = {
         material: variantDraft.material,
         price: variantDraft.price ?? null,
         stock: variantDraft.stock,
         discountMode: variantDraft.discountMode,
         discountPrice: variantDraft.discountPrice,
         colors: variantDraft.colors.map((c) => ({ hex: c.hex, images: c.images })),
      };
      setForm((prev) => ({ ...prev, VariantSchema: [...prev.VariantSchema, newVariant] }));
      setVariantDraft(emptyVariantDraft());
      setColorDraft({ hex: "#000000", images: [] });
      setErrors((prev) => ({ ...prev, variantMaterial: undefined, variantPrice: undefined, variantStock: undefined }));
   };

   const removeVariant = (material: string) => {
      setForm((prev) => ({ ...prev, VariantSchema: prev.VariantSchema.filter((v) => v.material !== material) }));
   };

   const removeColorFromVariant = (material: string, hex: string) => {
      setForm((prev) => ({
         ...prev,
         VariantSchema: prev.VariantSchema.map((v) => (v.material === material ? { ...v, colors: v.colors?.filter((c) => c.hex !== hex) } : v)),
      }));
   };

   const removeColorVariantImage = (material: string, hex: string, idx: number) => {
      setForm((prev) => ({
         ...prev,
         VariantSchema: prev.VariantSchema.map((v) => (v.material === material ? { ...v, colors: v.colors?.map((c) => (c.hex === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)) } : v)),
      }));
   };

   // ── Product images ────────────────────────────────────────────────────────
   const addImage = (key: "images" | "gallery", url: string) => {
      if (!url.trim()) return;
      setForm((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), url.trim()] }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const removeImage = (key: "images" | "gallery", idx: number) => {
      setForm((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }));
   };

   // ── Validate ──────────────────────────────────────────────────────────────
   const validate = (): boolean => {
      const e: FormErrors = {};
      if (!form.name?.trim()) e.name = "Name is required";
      if (!form.slug?.trim()) e.slug = "Slug is required";
      if (!form.category) e.category = "Category is required";
      if (!form.images.length) e.images = "Add at least one image";
      if (!form.isVariable) {
         if (!singleVariant.material) e.singleMaterial = "Select a material";
         if (!singleVariant.price || singleVariant.price <= 0) e.singlePrice = "Valid price required";
         if (singleVariant.stock === undefined || singleVariant.stock < 0) e.singleStock = "Stock is required";
      } else {
         if (!form.VariantSchema.length) e.VariantSchema = "Add at least one variant";
      }
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── Submit ────────────────────────────────────────────────────────────────
   const handleSubmit = async () => {
      if (!validate()) return;
      setLoading(true);
      let finalForm = { ...form };
      if (!form.isVariable) {
         finalForm.VariantSchema = [
            {
               material: singleVariant.material,
               price: singleVariant.price ?? null,
               stock: singleVariant.stock,
               discountMode: singleVariant.discountMode,
               discountPrice: singleVariant.discountPrice,
               colors: singleVariant.colors.map((c) => ({ hex: c.hex, images: c.images })),
            },
         ];
      }
      try {
         await new Promise((r) => setTimeout(r, 600));
         onSuccess?.(finalForm);
         setForm(emptyForm());
         setSingleVariant(emptySingleVariant());
      } finally {
         setLoading(false);
      }
   };

   const reset = () => {
      setForm(emptyForm());
      setErrors({});
      setSingleVariant(emptySingleVariant());
      setVariantDraft(emptyVariantDraft());
      setColorDraft({ hex: "#000000", images: [] });
   };

   const subCategories = CATEGORY_TREE.find((c) => c.id === form.category)?.children ?? [];

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
      removeImage,
      // single
      singleVariant,
      setSingleField,
      handleSingleDiscountModeChange,
      removeSingleColor,
      removeSingleColorImage,
      // multi
      variantDraft,
      setVariantDraftField,
      handleVariantDiscountModeChange,
      addVariant,
      removeVariant,
      removeColorFromVariant,
      removeColorVariantImage,
      // color draft (shared)
      colorDraft,
      setColorDraft,
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
