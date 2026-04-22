"use client";

import { useState, useRef, useEffect } from "react";
import { useProductForm, DiscountMode, ColorVariant } from "@/Validations/Useproductform";

interface AddProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: (product: any) => void;
}

type Tab = "basic" | "media" | "variants";

const tabs: { key: Tab; label: string }[] = [
   { key: "basic", label: "Basic Info" },
   { key: "media", label: "Images" },
   { key: "variants", label: "Variants" },
];

// ── Reusable ──────────────────────────────────────────────────────────────────
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

const Toggle = ({ active, onChange, label }: { active: boolean; onChange: () => void; label: string }) => (
   <div className="flex items-center justify-between py-1">
      <p className="text-[13px] font-medium text-headingColor">{label}</p>
      <button onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${active ? "bg-[#B8975A]" : "bg-[#5E5F60]/30"}`}>
         <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${active ? "-translate-x-4.5" : "translate-x-0.5"}`} />
      </button>
   </div>
);

// ── Discount block ────────────────────────────────────────────────────────────
function DiscountBlock({ discount, discountMode, discountPrice, onDiscountChange, onModeChange }: { discount: number | undefined; discountMode: DiscountMode; discountPrice: number | undefined; onDiscountChange: (v: string) => void; onModeChange: (m: DiscountMode) => void }) {
   return (
      <div className="bg-staticSecondaryBG rounded-xl p-3.5 flex flex-col gap-3">
         <div className="flex items-center justify-between">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60]">
               Discount <span className="normal-case">(optional)</span>
            </p>
            <div className="flex items-center bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg overflow-hidden">
               {(["static", "percentage"] as DiscountMode[]).map((mode) => (
                  <button key={mode} onClick={() => onModeChange(mode)} className={`px-3 py-1.5 text-[11px] transition-colors ${discountMode === mode ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}>
                     {mode === "static" ? "Fixed" : "Percentage %"}
                  </button>
               ))}
            </div>
         </div>
         <div className="grid grid-cols-2 gap-3">
            <div>
               <p className="text-[10px] text-[#5E5F60] mb-1">{discountMode === "percentage" ? "Discount %" : "Discount Amount (Rs)"}</p>
               <FieldInput type="number" value={discount} onChange={onDiscountChange} placeholder={discountMode === "percentage" ? "e.g. 20" : "e.g. 500"} />
            </div>
            <div>
               <p className="text-[10px] text-[#5E5F60] mb-1">Final Price (Rs)</p>
               <div className="px-3.5 py-2.5 bg-[#F5F0E8] border border-[#B8975A]/15 rounded-lg text-[13px] text-[#5E5F60]">{discountPrice ? `Rs ${discountPrice.toLocaleString()}` : "—"}</div>
            </div>
         </div>
      </div>
   );
}

// ── Image uploader ────────────────────────────────────────────────────────────
function ImageUploader({ label, images, onAdd, onRemove, error, firstLabel }: { label: string; images: string[]; onAdd: (url: string) => void; onRemove: (i: number) => void; error?: string; firstLabel?: string }) {
   const [urlInput, setUrlInput] = useState("");
   const fileRef = useRef<HTMLInputElement>(null);
   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      Array.from(e.target.files || []).forEach((file) => {
         const r = new FileReader();
         r.onload = () => onAdd(r.result as string);
         r.readAsDataURL(file);
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
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2.5 border border-[#B8975A]/20 bg-[#F5F0E8] text-[12px] text-[#5E5F60] rounded-lg hover:border-[#B8975A]/50 hover:text-headingColor transition-colors whitespace-nowrap">
               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
               </svg>
               Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
         </div>
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

// ── Color section (reused in both single & multi) ─────────────────────────────
function ColorSection({
   colorDraft,
   setColorDraft,
   addColorImage,
   removeColorImage,
   onAddColor,
   onRemoveColor,
   onRemoveColorImage,
   addedColors,
   errors,
}: {
   colorDraft: ColorVariant;
   setColorDraft: React.Dispatch<React.SetStateAction<ColorVariant>>;
   addColorImage: (url: string) => void;
   removeColorImage: (i: number) => void;
   onAddColor: () => void;
   onRemoveColor: (hex: string) => void;
   onRemoveColorImage: (hex: string, i: number) => void;
   addedColors: ColorVariant[];
   errors: { colorHex?: string; colorImage?: string };
}) {
   return (
      <div className="flex flex-col gap-3 border-t border-[#B8975A]/10 pt-3">
         <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60]">
            Color Swatches <span className="normal-case text-[#5E5F60]/60">(optional)</span>
         </p>

         {/* Picker */}
         <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 items-center">
               <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-[#B8975A]/20">
                  <input type="color" value={colorDraft.hex} onChange={(e) => setColorDraft((p) => ({ ...p, hex: e.target.value }))} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                  <div className="w-full h-full rounded-lg" style={{ backgroundColor: colorDraft.hex }} />
               </div>
               <p className="text-[9px] text-[#5E5F60] font-mono">{colorDraft.hex}</p>
            </div>
            <div className="flex-1">
               <p className="text-[11px] font-medium text-headingColor">Pick a color</p>
               <p className="text-[10px] text-[#5E5F60]">Add images then click Add Swatch</p>
            </div>
            {errors.colorHex && <p className="text-[10px] text-red-500">{errors.colorHex}</p>}
         </div>

         {/* Color image input */}
         <div>
            <div className="flex gap-2 mb-1.5">
               <input
                  id="colorUrlInput"
                  type="text"
                  placeholder="Paste image URL..."
                  className={`flex-1 px-3.5 py-2 text-[13px] bg-staticSecondaryBG border rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none transition-colors
                     ${errors.colorImage ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        addColorImage(e.currentTarget.value);
                        e.currentTarget.value = "";
                     }
                  }}
               />
               <button
                  onClick={() => {
                     const el = document.getElementById("colorUrlInput") as HTMLInputElement;
                     if (el) {
                        addColorImage(el.value);
                        el.value = "";
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
                        Array.from(e.target.files || []).forEach((f) => {
                           const r = new FileReader();
                           r.onload = () => addColorImage(r.result as string);
                           r.readAsDataURL(f);
                        });
                        e.target.value = "";
                     }}
                  />
               </label>
            </div>
            {errors.colorImage && <p className="text-[10px] text-red-500 mb-1">{errors.colorImage}</p>}
            {colorDraft.images.length > 0 && (
               <div className="grid grid-cols-5 gap-1.5 mb-2">
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

         <button onClick={onAddColor} className="w-full py-2 border border-dashed border-[#B8975A]/40 text-[#B8975A] text-[12px] rounded-lg hover:bg-[#B8975A]/5 transition-colors">
            + Add Color Swatch
         </button>

         {/* Added colors list */}
         {addedColors.length > 0 && (
            <div className="flex flex-col gap-2">
               <p className="text-[10px] tracking-widest uppercase text-[#5E5F60]">Added ({addedColors.length})</p>
               {addedColors.map((c) => (
                  <div key={c.hex} className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/10 overflow-hidden">
                     <div className="flex items-center gap-3 px-3 py-2 border-b border-[#B8975A]/10">
                        <div className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                        <p className="text-[11px] font-mono text-[#5E5F60] flex-1">{c.hex}</p>
                        <p className="text-[11px] text-[#5E5F60]">
                           {c.images.length} img{c.images.length !== 1 ? "s" : ""}
                        </p>
                        <button onClick={() => onRemoveColor(c.hex)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                           <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                           </svg>
                        </button>
                     </div>
                     <div className="p-2 grid grid-cols-5 gap-1.5">
                        {c.images.map((img, i) => (
                           <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#B8975A]/10 bg-[#F5F0E8]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => onRemoveColorImage(c.hex, i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                                    <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                 </svg>
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

// ── Added variant card (multi mode) ──────────────────────────────────────────
function VariantCard({ variant, onRemove, onRemoveColor, onRemoveColorImage }: { variant: import("@/Types/Collection/CollectionTypes").VariantSchema; onRemove: () => void; onRemoveColor: (hex: string) => void; onRemoveColorImage: (hex: string, i: number) => void }) {
   const [expanded, setExpanded] = useState(false);
   const hasColors = (variant.colors?.length ?? 0) > 0;
   return (
      <div className="bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10 overflow-hidden">
         <div className="flex items-center gap-3 px-3.5 py-3">
            <div className="flex-1 flex items-center gap-3 flex-wrap">
               <span className="text-[12px] font-medium text-headingColor">{variant.material}</span>
               <span className="text-[11px] text-[#5E5F60]">Rs {variant.price?.toLocaleString()}</span>
               <span className="text-[11px] text-[#5E5F60]">Stock: {variant.stock ?? 0}</span>
               {variant.discountPrice && <span className="text-[10px] bg-[#B8975A]/10 text-[#B8975A] px-2 py-0.5 rounded-full">→ Rs {variant.discountPrice.toLocaleString()}</span>}
            </div>
            {hasColors && (
               <button onClick={() => setExpanded((p) => !p)} className="flex items-center gap-1 text-[11px] text-[#5E5F60] hover:text-headingColor transition-colors">
                  {variant.colors!.length} color{variant.colors!.length !== 1 ? "s" : ""}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}>
                     <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            )}
            <button onClick={onRemove} className="text-[#5E5F60] hover:text-red-500 transition-colors shrink-0">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
               </svg>
            </button>
         </div>
         {expanded && hasColors && (
            <div className="border-t border-[#B8975A]/10 p-2.5 flex flex-col gap-2">
               {variant.colors!.map((c) => (
                  <div key={c.hex} className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/10 overflow-hidden">
                     <div className="flex items-center gap-2 px-3 py-2 border-b border-[#B8975A]/10">
                        <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                        <p className="text-[11px] font-mono text-[#5E5F60] flex-1">{c.hex}</p>
                        <button onClick={() => onRemoveColor(c.hex)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                           <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                           </svg>
                        </button>
                     </div>
                     <div className="p-2 grid grid-cols-5 gap-1.5">
                        {c.images.map((img, i) => (
                           <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#B8975A]/10 bg-[#F5F0E8]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => onRemoveColorImage(c.hex, i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                                    <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                 </svg>
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
   const [activeTab, setActiveTab] = useState<Tab>("basic");
   const overlayRef = useRef<HTMLDivElement>(null);

   const {
      form,
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
      removeColorFromVariantDraft,
      removeColorImageFromVariantDraft,
      // color draft (shared)
      colorDraft,
      setColorDraft,
      addColorImage,
      removeColorImage,
      addColorToTarget,
      // misc
      handleSubmit,
      reset,
      subCategories,
      BADGES,
      MATERIALS,
      CATEGORY_TREE,
   } = useProductForm((product) => {
      onSuccess?.(product);
      onClose();
   });

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
                     {t.key === "variants" && form.VariantSchema.length > 0 && <span className="ml-1.5 text-[10px] bg-[#B8975A]/15 text-[#B8975A] px-1.5 py-0.5 rounded-full">{form.VariantSchema.length}</span>}
                  </button>
               ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
               {/* ══ TAB 1: Basic Info ══ */}
               {activeTab === "basic" && (
                  <div className="flex flex-col gap-5">
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
                           <Toggle active={form.isVariable} onChange={handleVariableToggle} label="Variable Product" />
                           <p className="text-[10px] text-[#5E5F60] mt-0.5">{form.isVariable ? "Multiple variants — each with own price & stock" : "Single variant — one price & stock"}</p>
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

               {/* ══ TAB 3: Variants ══ */}
               {activeTab === "variants" && (
                  <div className="flex flex-col gap-6">
                     {/* ── SINGLE VARIANT MODE ── */}
                     {!form.isVariable && (
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#B8975A]/60" />
                              <p className="text-[11px] text-[#5E5F60]">
                                 Single variant — enable <span className="text-[#B8975A]">Variable Product</span> in Basic Info for multiple
                              </p>
                           </div>
                           <div>
                              <Label>Material *</Label>
                              <select value={singleVariant.material} onChange={(e) => setSingleField("material", e.target.value)} className={selectCls(errors.singleMaterial)}>
                                 <option value="">Select material...</option>
                                 {MATERIALS.map((m) => (
                                    <option key={m} value={m}>
                                       {m}
                                    </option>
                                 ))}
                              </select>
                              {errors.singleMaterial && <p className="text-[11px] text-red-500 mt-1">{errors.singleMaterial}</p>}
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <Label>Price (Rs) *</Label>
                                 <FieldInput type="number" value={singleVariant.price} onChange={(v) => setSingleField("price", v ? Number(v) : undefined)} placeholder="11000" error={errors.singlePrice} />
                              </div>
                              <div>
                                 <Label>Stock *</Label>
                                 <FieldInput type="number" value={singleVariant.stock} onChange={(v) => setSingleField("stock", v ? Number(v) : undefined)} placeholder="0" error={errors.singleStock} />
                              </div>
                           </div>
                           <DiscountBlock discount={singleVariant.discount} discountMode={singleVariant.discountMode} discountPrice={singleVariant.discountPrice} onDiscountChange={(v) => setSingleField("discount", v ? Number(v) : undefined)} onModeChange={handleSingleDiscountModeChange} />
                           {/* Colors for single variant */}
                           <ColorSection
                              colorDraft={colorDraft}
                              setColorDraft={setColorDraft}
                              addColorImage={addColorImage}
                              removeColorImage={removeColorImage}
                              onAddColor={() => addColorToTarget("single")}
                              onRemoveColor={removeSingleColor}
                              onRemoveColorImage={removeSingleColorImage}
                              addedColors={singleVariant.colors}
                              errors={{ colorHex: errors.colorHex, colorImage: errors.colorImage }}
                           />
                        </div>
                     )}

                     {/* ── MULTI VARIANT MODE ── */}
                     {form.isVariable && (
                        <div className="flex flex-col gap-5">
                           <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-4 border border-[#B8975A]/10">
                              <p className="text-[12px] font-medium text-headingColor tracking-[0.04em]">New Variant</p>
                              <div>
                                 <Label>Material *</Label>
                                 <select value={variantDraft.material} onChange={(e) => setVariantDraftField("material", e.target.value)} className={selectCls(errors.variantMaterial)}>
                                    <option value="">Select material...</option>
                                    {MATERIALS.map((m) => (
                                       <option key={m} value={m} disabled={form.VariantSchema.some((v) => v.material === m)}>
                                          {m}
                                          {form.VariantSchema.some((v) => v.material === m) ? " (added)" : ""}
                                       </option>
                                    ))}
                                 </select>
                                 {errors.variantMaterial && <p className="text-[11px] text-red-500 mt-1">{errors.variantMaterial}</p>}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <Label>Price (Rs) *</Label>
                                    <FieldInput type="number" value={variantDraft.price} onChange={(v) => setVariantDraftField("price", v ? Number(v) : undefined)} placeholder="11000" error={errors.variantPrice} />
                                 </div>
                                 <div>
                                    <Label>Stock *</Label>
                                    <FieldInput type="number" value={variantDraft.stock} onChange={(v) => setVariantDraftField("stock", v ? Number(v) : undefined)} placeholder="0" error={errors.variantStock} />
                                 </div>
                              </div>
                              <DiscountBlock discount={variantDraft.discount} discountMode={variantDraft.discountMode} discountPrice={variantDraft.discountPrice} onDiscountChange={(v) => setVariantDraftField("discount", v ? Number(v) : undefined)} onModeChange={handleVariantDiscountModeChange} />
                              {/* Colors for this draft variant */}
                              <ColorSection
                                 colorDraft={colorDraft}
                                 setColorDraft={setColorDraft}
                                 addColorImage={addColorImage}
                                 removeColorImage={removeColorImage}
                                 onAddColor={() => addColorToTarget("draft")}
                                 onRemoveColor={removeColorFromVariantDraft}
                                 onRemoveColorImage={removeColorImageFromVariantDraft}
                                 addedColors={variantDraft.colors}
                                 errors={{ colorHex: errors.colorHex, colorImage: errors.colorImage }}
                              />
                              <button onClick={addVariant} className="w-full py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium rounded-lg hover:bg-headingColor transition-colors mt-1">
                                 + Add Variant
                              </button>
                           </div>

                           {errors.VariantSchema && <p className="text-[11px] text-red-500 -mt-3">{errors.VariantSchema}</p>}

                           {form.VariantSchema.length > 0 && (
                              <div className="flex flex-col gap-3">
                                 <p className="text-[10px] tracking-widest uppercase text-[#5E5F60]">Added Variants ({form.VariantSchema.length})</p>
                                 {form.VariantSchema.map((v) => (
                                    <VariantCard key={v.material} variant={v} onRemove={() => removeVariant(v.material)} onRemoveColor={(hex) => removeColorFromVariant(v.material, hex)} onRemoveColorImage={(hex, i) => removeColorVariantImage(v.material, hex, i)} />
                                 ))}
                              </div>
                           )}

                           {form.VariantSchema.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#B8975A]/20 rounded-xl">
                                 <svg className="text-[#B8975A]/40 mb-2" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 14h10M14 9v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                 </svg>
                                 <p className="text-[12px] text-[#5E5F60]">No variants added yet</p>
                                 <p className="text-[11px] text-[#5E5F60]/70 mt-0.5">Fill the form above and click Add Variant</p>
                              </div>
                           )}
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
