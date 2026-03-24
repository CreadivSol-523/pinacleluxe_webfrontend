"use client";

import { useState } from "react";
import { Product, colorVariants } from "@/Types/Collection/CollectionTypes";

// Extended color type for admin (multiple images per color)
export interface ColorVariant {
   hex: string;
   images: string[]; // multiple images per color
}

export const BADGES = ["Hot Sellers", "New Arrival", "Pinacle Special", "Archive Sale"];
export const MATERIALS = ["Leather", "Canvas", "Suede", "Satin", "Nylon", "Velvet"];

// ── Category tree (replace with API later) ────────────────────────────────────
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

export interface ProductFormData extends Omit<Product, "id" | "colors"> {
   description: string;
   category: string;
   subCategory: string;
   discountMode: DiscountMode;
   isVariable: boolean;
   colorVariants: ColorVariant[];
}

const emptyForm = (): ProductFormData => ({
   name: "",
   slug: "",
   badge: "",
   description: "",
   price: undefined,
   discountPrice: undefined,
   discount: undefined,
   discountMode: "static",
   stock: undefined,
   category: "",
   subCategory: "",
   isVariable: false,
   material: [],
   colorVariants: [],
   images: [],
   gallery: [],
});

export type FormErrors = Partial<Record<keyof ProductFormData | "colorHex" | "colorImage", string>>;
export type SetColorDraft = React.Dispatch<React.SetStateAction<colorVariants>>;

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
   const [colorDraft, setColorDraft] = useState<ColorVariant>({ hex: "#000000", images: [] });
   const [loading, setLoading] = useState(false);

   // ── Field setters ─────────────────────────────────────────────────────────
   const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const handleNameChange = (name: string) => {
      setForm((prev) => ({ ...prev, name, slug: toSlug(name) }));
      setErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
   };

   // ── Discount logic ────────────────────────────────────────────────────────
   const handleDiscountChange = (val: string) => {
      const num = val ? Number(val) : undefined;
      if (form.discountMode === "percentage") {
         // num = discount % → discountPrice = price - (price * %) / 100
         const discountPrice = num !== undefined && form.price ? Math.round(form.price - (form.price * num) / 100) : undefined;
         setForm((prev) => ({ ...prev, discount: num, discountPrice }));
      } else {
         // num = discount amount (e.g. 500) → discountPrice = price - discount amount
         const discountPrice = num !== undefined && form.price ? Math.round(form.price - num) : undefined;
         setForm((prev) => ({ ...prev, discount: num, discountPrice }));
      }
      setErrors((prev) => ({ ...prev, discount: undefined }));
   };

   const handleDiscountModeChange = (mode: DiscountMode) => {
      setForm((prev) => ({ ...prev, discountMode: mode, discount: undefined, discountPrice: undefined }));
   };

   // ── Category ──────────────────────────────────────────────────────────────
   const handleCategoryChange = (catId: string) => {
      setForm((prev) => ({ ...prev, category: catId, subCategory: "" }));
      setErrors((prev) => ({ ...prev, category: undefined }));
   };

   // ── Material toggle ───────────────────────────────────────────────────────
   const toggleMaterial = (mat: string) => {
      setForm((prev) => ({
         ...prev,
         material: prev.material.includes(mat) ? prev.material.filter((m) => m !== mat) : [...prev.material, mat],
      }));
      setErrors((prev) => ({ ...prev, material: undefined }));
   };

   // ── Colors ────────────────────────────────────────────────────────────────
   const addColorImage = (url: string) => {
      if (!url.trim()) return;
      setColorDraft((prev: ColorVariant) => ({ ...prev, images: [...prev.images, url.trim()] }));
   };

   const removeColorImage = (idx: number) => {
      setColorDraft((prev: ColorVariant) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
   };

   const addColor = () => {
      if (!colorDraft.images.length) {
         setErrors((prev) => ({ ...prev, colorImage: "Add at least one image" }));
         return;
      }
      if (form.colorVariants?.some((c) => c.hex === colorDraft.hex)) {
         setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
         return;
      }
      setForm((prev) => ({ ...prev, colorVariants: [...(prev.colorVariants || []), { ...colorDraft }] }));
      setColorDraft({ hex: "#000000", images: [] });
      setErrors((prev) => ({ ...prev, colorHex: undefined, colorImage: undefined }));
   };

   const removeColor = (hex: string) => {
      setForm((prev) => ({ ...prev, colorVariants: prev.colorVariants?.filter((c) => c.hex !== hex) }));
   };

   const removeColorVariantImage = (hex: string, idx: number) => {
      setForm((prev) => ({
         ...prev,
         colorVariants: prev.colorVariants?.map((c) => (c.hex === hex ? { ...c, images: c.images.filter((_, i) => i !== idx) } : c)),
      }));
   };

   // ── Images ────────────────────────────────────────────────────────────────
   const addImage = (key: "images" | "gallery", url: string) => {
      if (!url.trim()) return;
      setForm((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), url.trim()] }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const removeImage = (key: "images" | "gallery", idx: number) => {
      setForm((prev) => ({
         ...prev,
         [key]: (prev[key] as string[]).filter((_, i) => i !== idx),
      }));
   };

   // ── Validate ──────────────────────────────────────────────────────────────
   const validate = (): boolean => {
      const e: FormErrors = {};
      if (!form.name?.trim()) e.name = "Name is required";
      if (!form.slug?.trim()) e.slug = "Slug is required";
      if (!form.price || form.price <= 0) e.price = "Valid price required";
      if (form.stock === undefined || form.stock < 0) e.stock = "Stock is required";
      if (!form.category) e.category = "Category is required";
      if (!form.material.length) e.material = "Select at least one material";
      if (!form.images.length) e.images = "Add at least one image";
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── Submit ────────────────────────────────────────────────────────────────
   const handleSubmit = async () => {
      if (!validate()) return;
      setLoading(true);
      try {
         await new Promise((r) => setTimeout(r, 600));
         onSuccess?.(form);
         setForm(emptyForm());
      } finally {
         setLoading(false);
      }
   };

   const reset = () => {
      setForm(emptyForm());
      setErrors({});
      setColorDraft({ hex: "#000000", images: [] });
   };

   // Subcategories for selected category
   const subCategories = CATEGORY_TREE.find((c) => c.id === form.category)?.children ?? [];

   return {
      form,
      setForm,
      errors,
      colorDraft,
      loading,
      setField,
      handleNameChange,
      toggleMaterial,
      setColorDraft,
      addColor,
      removeColor,
      addImage,
      removeImage,
      handleSubmit,
      reset,
      handleDiscountChange,
      handleDiscountModeChange,
      handleCategoryChange,
      subCategories,
      BADGES,
      MATERIALS,
      CATEGORY_TREE,
      addColorImage,
      removeColorImage,
      removeColorVariantImage,
   };
}
