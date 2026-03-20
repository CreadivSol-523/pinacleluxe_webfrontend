"use client";

import { useState } from "react";
import { Product, ProductColor } from "@/Types/Collection/CollectionTypes";

const BADGES = ["Hot Sellers", "New Arrival", "Pinacle Special", "Archive Sale"];
const MATERIALS = ["Leather", "Canvas", "Suede", "Satin", "Nylon", "Velvet"];

const emptyForm = (): Omit<Product, "id"> => ({
   name: "",
   slug: "",
   badge: "",
   price: undefined,
   discountPrice: undefined,
   discount: undefined,
   stock: undefined,
   category: "",
   material: [],
   colors: [],
   images: [],
   gallery: [],
});

export type FormErrors = Partial<Record<keyof Product | "colorHex" | "colorImage", string>>;
export type SetColorDraft = React.Dispatch<React.SetStateAction<ProductColor>>;

function toSlug(name: string) {
   return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
}

export function useProductForm(onSuccess?: (product: Omit<Product, "id">) => void) {
   const [form, setForm] = useState<Omit<Product, "id">>(emptyForm());
   const [errors, setErrors] = useState<FormErrors>({});
   const [colorDraft, setColorDraft] = useState<ProductColor>({ hex: "#000000", image: "" });
   const [loading, setLoading] = useState(false);

   // ── Field setters ──────────────────────────────────────────────────────────
   const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
   };

   const handleNameChange = (name: string) => {
      setForm((prev) => ({ ...prev, name, slug: toSlug(name) }));
      setErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
   };

   // ── Material toggle ────────────────────────────────────────────────────────
   const toggleMaterial = (mat: string) => {
      setForm((prev) => ({
         ...prev,
         material: prev.material.includes(mat) ? prev.material.filter((m) => m !== mat) : [...prev.material, mat],
      }));
      setErrors((prev) => ({ ...prev, material: undefined }));
   };

   // ── Colors ─────────────────────────────────────────────────────────────────
   const addColor = () => {
      if (!colorDraft.image.trim()) {
         setErrors((prev) => ({ ...prev, colorImage: "Image URL required" }));
         return;
      }
      const already = form.colors?.some((c) => c.hex === colorDraft.hex);
      if (already) {
         setErrors((prev) => ({ ...prev, colorHex: "Color already added" }));
         return;
      }
      setForm((prev) => ({ ...prev, colors: [...(prev.colors || []), { ...colorDraft }] }));
      setColorDraft({ hex: "#000000", image: "" });
      setErrors((prev) => ({ ...prev, colorHex: undefined, colorImage: undefined }));
   };

   const removeColor = (hex: string) => {
      setForm((prev) => ({ ...prev, colors: prev.colors?.filter((c) => c.hex !== hex) }));
   };

   // ── Image arrays ───────────────────────────────────────────────────────────
   const addImage = (key: "images" | "gallery", url: string) => {
      if (!url.trim()) return;
      setForm((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), url.trim()] }));
   };

   const removeImage = (key: "images" | "gallery", idx: number) => {
      setForm((prev) => ({
         ...prev,
         [key]: (prev[key] as string[]).filter((_, i) => i !== idx),
      }));
   };

   // ── Validation ─────────────────────────────────────────────────────────────
   const validate = (): boolean => {
      const e: FormErrors = {};
      if (!form.name?.trim()) e.name = "Name is required";
      if (!form.slug?.trim()) e.slug = "Slug is required";
      if (!form.price || form.price <= 0) e.price = "Valid price is required";
      if (form.stock === undefined || form.stock < 0) e.stock = "Stock is required";
      if (!(form as any).category) e.category = "Category is required";
      if (!form.material.length) e.material = "Select at least one material";
      if (!form.images.length) e.images = "Add at least one image";
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── Submit ─────────────────────────────────────────────────────────────────
   const handleSubmit = async () => {
      if (!validate()) return;
      setLoading(true);
      try {
         // wire to API later — for now just pass data up
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
      setColorDraft({ hex: "#000000", image: "" });
   };

   return {
      form,
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
      BADGES,
      MATERIALS,
   };
}
