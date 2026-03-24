"use client";

import { useState, useRef, useEffect } from "react";

import { useProductForm, DiscountMode, ColorVariant } from "@/Validations/Useproductform";
import { Product } from "@/Types/Collection/CollectionTypes";

interface UpdateProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: (product: any) => void;
   initialData?: Product;
}

type Tab = "basic" | "media" | "variants";

const tabs: { key: Tab; label: string }[] = [
   { key: "basic", label: "Basic Info" },
   { key: "media", label: "Images" },
   { key: "variants", label: "Colors & Material" },
];

// ── Reusable components ───────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60] mb-1.5">{children}</p>;

const FieldInput = ({ value, onChange, placeholder, type = "text", error }: { value: string | number | undefined; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string }) => (
   <div>
      <input
         type={type}
         value={value ?? ""}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none transition-colors
            ${error ? "border-red-400 focus:border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
   </div>
);

const selectCls = (error?: string) =>
   `w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border rounded-lg text-headingColor focus:outline-none transition-colors cursor-pointer
   ${error ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`;

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ active, onChange, label }: { active: boolean; onChange: () => void; label: string }) => (
   <div className="flex items-center justify-between py-1">
      <p className="text-[13px] font-medium text-headingColor">{label}</p>
      <button
         onClick={onChange}
         className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
            ${active ? "bg-[#B8975A]" : "bg-[#5E5F60]/30"}`}
      >
         <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
            ${active ? "-translate-x-4.5" : "translate-x-0.5"}`}
         />
      </button>
   </div>
);

// ── Image uploader (URL + file upload) ────────────────────────────────────────
function ImageUploader({ label, images, onAdd, onRemove, error, firstLabel }: { label: string; images: string[]; onAdd: (url: string) => void; onRemove: (i: number) => void; error?: string; firstLabel?: string }) {
   const [urlInput, setUrlInput] = useState("");
   const fileRef = useRef<HTMLInputElement>(null);

   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      Array.from(files).forEach((file) => {
         const reader = new FileReader();
         reader.onload = () => onAdd(reader.result as string);
         reader.readAsDataURL(file);
      });
      e.target.value = "";
   };

   const handleUrl = () => {
      if (!urlInput.trim()) return;
      onAdd(urlInput.trim());
      setUrlInput("");
   };

   return (
      <div>
         <Label>{label}</Label>
         {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}

         {/* URL input row */}
         <div className="flex gap-2 mb-2">
            <input
               type="text"
               value={urlInput}
               onChange={(e) => setUrlInput(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") handleUrl();
               }}
               placeholder="Paste image URL..."
               className="flex-1 px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
            />
            <button onClick={handleUrl} className="px-3 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] rounded-lg hover:bg-headingColor transition-colors whitespace-nowrap">
               Add URL
            </button>
            {/* Upload button */}
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2.5 border border-[#B8975A]/20 bg-[#F5F0E8] text-[12px] text-[#5E5F60] rounded-lg hover:border-[#B8975A]/50 hover:text-headingColor transition-colors whitespace-nowrap">
               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
               </svg>
               Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
         </div>

         {/* Preview grid */}
         {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
               {images.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden bg-[#F5F0E8] aspect-square border border-[#B8975A]/10">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={url} alt="" className="w-full h-full object-cover" />
                     <button onClick={() => onRemove(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                           <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                     </button>
                     {i === 0 && firstLabel && <span className="absolute bottom-1 left-1 text-[9px] bg-primaryBG text-[#B8975A] px-1.5 py-0.5 rounded">{firstLabel}</span>}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function UpdateProductModal({ isOpen, onClose, onSuccess, initialData }: UpdateProductModalProps) {
   const [activeTab, setActiveTab] = useState<Tab>("basic");
   const overlayRef = useRef<HTMLDivElement>(null);

   const {
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
      setForm,
   } = useProductForm((product) => {
      onSuccess?.(product);
      onClose();
   });

   useEffect(() => {
      //   setForm({
      //      description: initialData?.description||"",
      //      category:initialData?.category||"",
      //      subCategory:"Pending",
      //      colorVariants:initialData?.colorVariants ?? [],
      //      discountMode:"percentage",
      //      gallery:initialData?.gallery ?? [],
      //      images:initialData?.images ?? [],
      //      isVariable:initialData?.isVariable ?? false,

      //   });
      setForm({
         name: initialData?.name,
         slug: initialData?.slug,
         badge: initialData?.badge,
         description: initialData?.description ?? "",
         price: initialData?.price,
         discountPrice: initialData?.discountPrice,
         discount: initialData?.discount,
         discountMode: initialData?.discountMode ?? "percentage",
         stock: initialData?.stock,
         category: initialData?.category ?? "",
         subCategory: initialData?.subCategory ?? "",
         isVariable: initialData?.isVariable ?? false,
         material: initialData?.material ?? [],
         colorVariants: initialData?.colorVariants ?? [],
         images: initialData?.images ?? [],
         gallery: initialData?.gallery ?? [],
      });
   }, []);
   console.log(form);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [onClose]);

   if (!isOpen) return null;

   const handleClose = () => {
      reset();
      onClose();
   };

   return (
      <div
         ref={overlayRef}
         onClick={(e) => {
            if (e.target === overlayRef.current) handleClose();
         }}
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      >
         <div className="w-full max-w-2xl bg-staticSecondaryBG rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#B8975A]/15">
               <div>
                  <h2 className="font-serif text-[20px] font-semibold text-headingColor tracking-[0.04em]">Add Product</h2>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">Fill in product details across all tabs</p>
               </div>
               <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                     <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
               </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#B8975A]/15 px-6">
               {tabs.map((t) => (
                  <button
                     key={t.key}
                     onClick={() => setActiveTab(t.key)}
                     className={`px-4 py-3 text-[12px] font-medium tracking-[0.06em] border-b-2 transition-all duration-150 -mb-px
                        ${activeTab === t.key ? "border-[#B8975A] text-[#B8975A]" : "border-transparent text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {t.label}
                  </button>
               ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
               {/* ══ TAB 1: Basic Info ══ */}
               {activeTab === "basic" && (
                  <div className="flex flex-col gap-5">
                     {/* Name + Slug */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Product Name *</Label>
                           <FieldInput value={form.name} onChange={handleNameChange} placeholder="e.g. Easy Zipper Tote" error={errors.name} />
                        </div>
                        <div>
                           <Label>Slug *</Label>
                           <FieldInput value={form.slug} onChange={(v) => setField("slug", v)} placeholder="auto-generated" error={errors.slug} />
                        </div>
                     </div>

                     {/* Description */}
                     <div>
                        <Label>Description</Label>
                        <textarea
                           value={form.description}
                           onChange={(e) => setField("description", e.target.value)}
                           placeholder="Product description..."
                           rows={3}
                           className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors resize-none"
                        />
                     </div>

                     {/* Price + Stock */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Price (Rs) *</Label>
                           <FieldInput type="number" value={form.price} onChange={(v) => setField("price", v ? Number(v) : undefined)} placeholder="11000" error={errors.price} />
                        </div>
                        <div>
                           <Label>Stock *</Label>
                           <FieldInput type="number" value={form.stock} onChange={(v) => setField("stock", v ? Number(v) : undefined)} placeholder="0" error={errors.stock} />
                        </div>
                     </div>

                     {/* Discount section */}
                     <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                           <Label>Discount</Label>
                           {/* Mode toggle */}
                           <div className="flex items-center bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg overflow-hidden">
                              {(["static", "percentage"] as DiscountMode[]).map((mode) => (
                                 <button
                                    key={mode}
                                    onClick={() => handleDiscountModeChange(mode)}
                                    className={`px-3 py-1.5 text-[11px] transition-colors
                                       ${form.discountMode === mode ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                                 >
                                    {mode === "static" ? "Fixed Price" : "Percentage %"}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <p className="text-[10px] text-[#5E5F60] mb-1">{form.discountMode === "percentage" ? "Discount %" : "Discount Amount (Rs)"}</p>
                              <FieldInput type="number" value={form.discount} onChange={handleDiscountChange} placeholder={form.discountMode === "percentage" ? "e.g. 20" : "e.g. 500"} />
                           </div>
                           <div>
                              <p className="text-[10px] text-[#5E5F60] mb-1">Final Price (Rs)</p>
                              <div className="px-3.5 py-2.5 bg-staticSecondaryBG border border-[#B8975A]/15 rounded-lg text-[13px] text-[#5E5F60]">{form.discountPrice ? `Rs ${form.discountPrice.toLocaleString()}` : "—"}</div>
                           </div>
                        </div>
                     </div>

                     {/* Category + Subcategory */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Category *</Label>
                           <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)} className={selectCls(errors.category)}>
                              <option value="">Select category...</option>
                              {CATEGORY_TREE.map((c) => (
                                 <option key={c.id} value={c.id}>
                                    {c.name}
                                 </option>
                              ))}
                           </select>
                           {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
                        </div>
                        <div>
                           <Label>Sub-Category</Label>
                           <select value={form.subCategory} onChange={(e) => setField("subCategory", e.target.value)} disabled={!subCategories.length} className={`${selectCls()} disabled:opacity-40 disabled:cursor-not-allowed`}>
                              <option value="">{!form.category ? "Select category first" : subCategories.length === 0 ? "No subcategories" : "Select sub-category..."}</option>
                              {subCategories.map((s) => (
                                 <option key={s.id} value={s.id}>
                                    {s.name}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Badge + Variable toggle */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Badge</Label>
                           <select value={form.badge ?? ""} onChange={(e) => setField("badge", e.target.value)} className={selectCls()}>
                              <option value="">No Badge</option>
                              {BADGES.map((b) => (
                                 <option key={b} value={b}>
                                    {b}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="flex flex-col justify-end pb-0.5">
                           <Toggle active={form.isVariable} onChange={() => setField("isVariable", !form.isVariable)} label="Variable Product" />
                           <p className="text-[10px] text-[#5E5F60] mt-0.5">Enable color swatches per variant</p>
                        </div>
                     </div>
                  </div>
               )}

               {/* ══ TAB 2: Images ══ */}
               {activeTab === "media" && (
                  <div className="flex flex-col gap-6">
                     <ImageUploader label="Main Images * (shown on product card)" images={form.images} onAdd={(url) => addImage("images", url)} onRemove={(i) => removeImage("images", i)} error={errors.images} firstLabel="Main" />
                     <div className="border-t border-[#B8975A]/10" />
                     <ImageUploader label="Gallery Images (shown on hover)" images={form.gallery} onAdd={(url) => addImage("gallery", url)} onRemove={(i) => removeImage("gallery", i)} />
                  </div>
               )}

               {/* ══ TAB 3: Colors & Material ══ */}
               {activeTab === "variants" && (
                  <div className="flex flex-col gap-6">
                     {/* Material */}
                     <div>
                        <Label>Material * (select all that apply)</Label>
                        {errors.material && <p className="text-[11px] text-red-500 mb-2">{errors.material}</p>}
                        <div className="flex flex-wrap gap-2">
                           {MATERIALS.map((mat) => {
                              const active = form.material.includes(mat);
                              return (
                                 <button
                                    key={mat}
                                    onClick={() => toggleMaterial(mat)}
                                    className={`px-4 py-2 text-[12px] rounded-lg border transition-all duration-150
                                       ${active ? "bg-primaryBG text-[#B8975A] border-primaryBG" : "bg-[#F5F0E8] text-[#5E5F60] border-[#B8975A]/20 hover:border-[#B8975A]/50 hover:text-headingColor"}`}
                                 >
                                    {mat}
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Color swatches — only if variable product */}
                     {form.isVariable ? (
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center justify-between">
                              <Label>Color Variants</Label>
                              <span className="text-[10px] bg-[#B8975A]/10 text-[#B8975A] px-2 py-0.5 rounded-full">Variable Product</span>
                           </div>

                           {/* ── Draft: color picker + images ── */}
                           <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-3 border border-[#B8975A]/10">
                              {/* Color picker row */}
                              <div className="flex items-center gap-3">
                                 <div className="flex flex-col gap-1 items-center">
                                    <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-[#B8975A]/20">
                                       <input type="color" value={colorDraft.hex} onChange={(e) => setColorDraft((prev: ColorVariant) => ({ ...prev, hex: e.target.value }))} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                                       <div className="w-full h-full rounded-lg" style={{ backgroundColor: colorDraft.hex }} />
                                    </div>
                                    <p className="text-[9px] text-[#5E5F60] font-mono">{colorDraft.hex}</p>
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-[11px] font-medium text-headingColor">Selected Color</p>
                                    <p className="text-[10px] text-[#5E5F60]">Add images below for this color variant</p>
                                 </div>
                                 {errors.colorHex && <p className="text-[10px] text-red-500">{errors.colorHex}</p>}
                              </div>

                              {/* Image input for draft */}
                              <div>
                                 <p className="text-[10px] text-[#5E5F60] mb-1.5">Images for this color</p>
                                 <div className="flex gap-2 mb-2">
                                    <input
                                       id="colorUrlInput"
                                       type="text"
                                       placeholder="Paste image URL..."
                                       className={`flex-1 px-3.5 py-2 text-[13px] bg-staticSecondaryBG border rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none transition-colors
                                          ${errors.colorImage ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`}
                                       onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                             const input = e.currentTarget;
                                             addColorImage(input.value);
                                             input.value = "";
                                          }
                                       }}
                                    />
                                    <button
                                       onClick={() => {
                                          const input = document.getElementById("colorUrlInput") as HTMLInputElement;
                                          if (input) {
                                             addColorImage(input.value);
                                             input.value = "";
                                          }
                                       }}
                                       className="px-3 py-2 bg-primaryBG text-[#B8975A] text-[12px] rounded-lg hover:bg-headingColor transition-colors whitespace-nowrap"
                                    >
                                       Add URL
                                    </button>
                                    <label className="flex items-center gap-1 px-3 py-2 border border-[#B8975A]/20 bg-staticSecondaryBG text-[12px] text-[#5E5F60] rounded-lg hover:border-[#B8975A]/50 cursor-pointer transition-colors whitespace-nowrap">
                                       <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                          <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                       </svg>
                                       Upload
                                       <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          className="hidden"
                                          onChange={(e) => {
                                             Array.from(e.target.files || []).forEach((file) => {
                                                const reader = new FileReader();
                                                reader.onload = () => addColorImage(reader.result as string);
                                                reader.readAsDataURL(file);
                                             });
                                             e.target.value = "";
                                          }}
                                       />
                                    </label>
                                 </div>
                                 {errors.colorImage && <p className="text-[10px] text-red-500 mb-1">{errors.colorImage}</p>}

                                 {/* Draft image previews */}
                                 {colorDraft.images.length > 0 && (
                                    <div className="grid grid-cols-5 gap-1.5">
                                       {colorDraft.images.map((img, i) => (
                                          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#B8975A]/15 bg-staticSecondaryBG">
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img src={img} alt="" className="w-full h-full object-cover" />
                                             <button onClick={() => removeColorImage(i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                                                   <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                             </button>
                                             {i === 0 && <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-primaryBG text-[#B8975A] px-1 py-0.5 rounded leading-none">Main</span>}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>

                              {/* Add variant button */}
                              <button onClick={addColor} className="w-full py-2 bg-primaryBG text-[#B8975A] text-[12px] font-medium rounded-lg hover:bg-headingColor transition-colors">
                                 + Add Color Variant
                              </button>
                           </div>

                           {/* ── Added variants list ── */}
                           {(form.colorVariants?.length ?? 0) > 0 && (
                              <div className="flex flex-col gap-2">
                                 <p className="text-[10px] tracking-[0.1em] uppercase text-[#5E5F60]">Added Variants ({form.colorVariants?.length})</p>
                                 {form.colorVariants?.map((c) => (
                                    <div key={c.hex} className="bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10 overflow-hidden">
                                       {/* Variant header */}
                                       <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[#B8975A]/10">
                                          <div className="w-6 h-6 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                                          <p className="text-[11px] font-mono text-[#5E5F60] flex-1">{c.hex}</p>
                                          <p className="text-[11px] text-[#5E5F60]">
                                             {c.images.length} image{c.images.length !== 1 ? "s" : ""}
                                          </p>
                                          <button onClick={() => removeColor(c.hex)} className="text-[#5E5F60] hover:text-red-500 transition-colors shrink-0">
                                             <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                             </svg>
                                          </button>
                                       </div>
                                       {/* Images preview */}
                                       <div className="p-2.5 grid grid-cols-5 gap-1.5">
                                          {c.images.map((img, i) => (
                                             <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#B8975A]/10 bg-staticSecondaryBG">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => removeColorVariantImage(c.hex, i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                   <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                                                      <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                                   </svg>
                                                </button>
                                                {i === 0 && <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-primaryBG text-[#B8975A] px-1 py-0.5 rounded leading-none">Main</span>}
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#B8975A]/20 rounded-xl">
                           <svg className="text-[#B8975A]/40 mb-2" width="28" height="28" viewBox="0 0 28 28" fill="none">
                              <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="6" cy="14" r="3" stroke="currentColor" strokeWidth="1.3" />
                              <circle cx="22" cy="14" r="3" stroke="currentColor" strokeWidth="1.3" />
                           </svg>
                           <p className="text-[12px] text-[#5E5F60]">
                              Enable <span className="text-[#B8975A]">Variable Product</span> in Basic Info tab
                           </p>
                           <p className="text-[11px] text-[#5E5F60]/70 mt-0.5">to add color swatches per variant</p>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#B8975A]/15 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  {activeTab !== "basic" && (
                     <button onClick={() => setActiveTab(activeTab === "media" ? "basic" : "media")} className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                     </button>
                  )}
                  {activeTab !== "variants" && (
                     <button onClick={() => setActiveTab(activeTab === "basic" ? "media" : "variants")} className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors">
                        Next
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  )}
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={handleClose} className="px-5 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors">
                     Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                     {loading ? (
                        <>
                           <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                           </svg>
                           Saving...
                        </>
                     ) : (
                        <>
                           <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                           Save Product
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
