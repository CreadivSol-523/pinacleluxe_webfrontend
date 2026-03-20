"use client";

import { useState, useRef, useEffect } from "react";
import { ProductColor } from "@/Types/Collection/CollectionTypes";
import { useProductForm } from "@/Validations/Useproductform";

interface AddProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: (product: any) => void;
}

// Replace with API call later
const CATEGORIES = [
   { id: "cat_totes", name: "Totes" },
   { id: "cat_shoulder", name: "Shoulder Bags" },
   { id: "cat_crossbody", name: "Crossbody" },
   { id: "cat_hobo", name: "Hobo" },
   { id: "cat_clutch", name: "Clutch" },
   { id: "cat_small", name: "Small Leather Goods" },
];

type Tab = "basic" | "media" | "variants";

const tabs: { key: Tab; label: string }[] = [
   { key: "basic", label: "Basic Info" },
   { key: "media", label: "Images" },
   { key: "variants", label: "Colors & Material" },
];

// ── Small reusables ────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60] mb-1.5">{children}</p>;

const Input = ({ value, onChange, placeholder, type = "text", error }: { value: string | number | undefined; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string }) => (
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

// ── Main Modal ─────────────────────────────────────────────────────────────────

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
   const [activeTab, setActiveTab] = useState<Tab>("basic");
   const [imageInput, setImageInput] = useState("");
   const [galleryInput, setGalleryInput] = useState("");
   const overlayRef = useRef<HTMLDivElement>(null);

   const { form, errors, colorDraft, loading, setField, handleNameChange, toggleMaterial, setColorDraft, addColor, removeColor, addImage, removeImage, handleSubmit, reset, BADGES, MATERIALS } = useProductForm((product) => {
      onSuccess?.(product);
      onClose();
   });

   // close on ESC
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
            {/* ── Header ── */}
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

            {/* ── Tabs ── */}
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

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
               {/* ════════ TAB 1: Basic Info ════════ */}
               {activeTab === "basic" && (
                  <div className="flex flex-col gap-5">
                     {/* Name + Slug */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Product Name *</Label>
                           <Input value={form.name} onChange={handleNameChange} placeholder="e.g. Easy Zipper Tote" error={errors.name} />
                        </div>
                        <div>
                           <Label>Slug *</Label>
                           <Input value={form.slug} onChange={(v) => setField("slug", v)} placeholder="auto-generated" error={errors.slug} />
                        </div>
                     </div>

                     {/* Price + Discount Price + Discount % */}
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                           <Label>Price (Rs) *</Label>
                           <Input type="number" value={form.price} onChange={(v) => setField("price", v ? Number(v) : undefined)} placeholder="11000" error={errors.price} />
                        </div>
                        <div>
                           <Label>Discount Price</Label>
                           <Input type="number" value={form.discountPrice} onChange={(v) => setField("discountPrice", v ? Number(v) : undefined)} placeholder="2500" />
                        </div>
                        <div>
                           <Label>Discount %</Label>
                           <Input type="number" value={form.discount} onChange={(v) => setField("discount", v ? Number(v) : undefined)} placeholder="80" />
                        </div>
                     </div>

                     {/* Stock + Badge */}
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Stock *</Label>
                           <Input type="number" value={form.stock} onChange={(v) => setField("stock", v ? Number(v) : undefined)} placeholder="0" error={errors.stock} />
                        </div>
                        <div>
                           <Label>Badge</Label>
                           <select
                              value={form.badge ?? ""}
                              onChange={(e) => setField("badge", e.target.value)}
                              className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/60 transition-colors cursor-pointer"
                           >
                              <option value="">No Badge</option>
                              {BADGES.map((b) => (
                                 <option key={b} value={b}>
                                    {b}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Category */}
                     <div>
                        <Label>Category *</Label>
                        <select
                           value={(form as any).category ?? ""}
                           onChange={(e) => setField("category" as any, e.target.value)}
                           className={
                              (errors as any).category
                                 ? "w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-red-400 rounded-lg text-headingColor focus:outline-none transition-colors cursor-pointer"
                                 : "w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/60 transition-colors cursor-pointer"
                           }
                        >
                           <option value="">Select category...</option>
                           {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                 {c.name}
                              </option>
                           ))}
                        </select>
                        {(errors as any).category && <p className="text-[11px] text-red-500 mt-1">{(errors as any).category}</p>}
                     </div>
                  </div>
               )}

               {/* ════════ TAB 2: Images ════════ */}
               {activeTab === "media" && (
                  <div className="flex flex-col gap-6">
                     {/* Main Images */}
                     <div>
                        <Label>Main Images * (shown on product card)</Label>
                        {errors.images && <p className="text-[11px] text-red-500 mb-2">{errors.images}</p>}
                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={imageInput}
                              onChange={(e) => setImageInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                    addImage("images", imageInput);
                                    setImageInput("");
                                 }
                              }}
                              placeholder="Paste image URL and press Enter"
                              className="flex-1 px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                           />
                           <button
                              onClick={() => {
                                 addImage("images", imageInput);
                                 setImageInput("");
                              }}
                              className="px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] rounded-lg hover:bg-headingColor transition-colors"
                           >
                              Add
                           </button>
                        </div>
                        {form.images.length > 0 && (
                           <div className="grid grid-cols-4 gap-2 mt-3">
                              {form.images.map((url, i) => (
                                 <div key={i} className="relative group rounded-lg overflow-hidden bg-[#F5F0E8] aspect-square">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeImage("images", i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                       <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                          <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                       </svg>
                                    </button>
                                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-primaryBG text-[#B8975A] px-1.5 py-0.5 rounded">Main</span>}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     {/* Gallery */}
                     <div>
                        <Label>Gallery Images (shown on hover)</Label>
                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={galleryInput}
                              onChange={(e) => setGalleryInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                    addImage("gallery", galleryInput);
                                    setGalleryInput("");
                                 }
                              }}
                              placeholder="Paste gallery URL and press Enter"
                              className="flex-1 px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
                           />
                           <button
                              onClick={() => {
                                 addImage("gallery", galleryInput);
                                 setGalleryInput("");
                              }}
                              className="px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] rounded-lg hover:bg-headingColor transition-colors"
                           >
                              Add
                           </button>
                        </div>
                        {form.gallery.length > 0 && (
                           <div className="grid grid-cols-4 gap-2 mt-3">
                              {form.gallery.map((url, i) => (
                                 <div key={i} className="relative group rounded-lg overflow-hidden bg-[#F5F0E8] aspect-square">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeImage("gallery", i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                       <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                          <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                       </svg>
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* ════════ TAB 3: Colors & Material ════════ */}
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

                     {/* Color variants */}
                     <div>
                        <Label>Color Variants</Label>
                        {/* Color draft row */}
                        <div className="flex gap-3 items-start">
                           {/* Color picker */}
                           <div className="flex flex-col gap-1">
                              <p className="text-[10px] text-[#5E5F60]">Hex</p>
                              <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-[#B8975A]/20">
                                 <input type="color" value={colorDraft.hex} onChange={(e) => setColorDraft((prev: ProductColor) => ({ ...prev, hex: e.target.value }))} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                                 <div className="w-full h-full rounded-lg" style={{ backgroundColor: colorDraft.hex }} />
                              </div>
                              <p className="text-[9px] text-[#5E5F60] text-center">{colorDraft.hex}</p>
                              {errors.colorHex && <p className="text-[10px] text-red-500">{errors.colorHex}</p>}
                           </div>

                           {/* Image URL */}
                           <div className="flex-1 flex flex-col gap-1">
                              <p className="text-[10px] text-[#5E5F60]">Image URL for this color</p>
                              <input
                                 type="text"
                                 value={colorDraft.image}
                                 onChange={(e) => setColorDraft((prev: ProductColor) => ({ ...prev, image: e.target.value }))}
                                 placeholder="https://..."
                                 className={`w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none transition-colors
                                    ${errors.colorImage ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`}
                              />
                              {errors.colorImage && <p className="text-[10px] text-red-500">{errors.colorImage}</p>}
                           </div>

                           {/* Add color btn */}
                           <div className="flex flex-col gap-1">
                              <p className="text-[10px] text-[#5E5F60] invisible">add</p>
                              <button onClick={addColor} className="px-4 h-10 bg-primaryBG text-[#B8975A] text-[12px] rounded-lg hover:bg-headingColor transition-colors whitespace-nowrap">
                                 + Add
                              </button>
                           </div>
                        </div>

                        {/* Added colors list */}
                        {(form.colors?.length ?? 0) > 0 && (
                           <div className="mt-4 flex flex-col gap-2">
                              {form.colors?.map((c) => (
                                 <div key={c.hex} className="flex items-center gap-3 p-2.5 bg-[#F5F0E8] rounded-lg border border-[#B8975A]/10">
                                    <div className="w-7 h-7 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                                    <p className="text-[11px] font-mono text-[#5E5F60]">{c.hex}</p>
                                    <p className="text-[11px] text-[#5E5F60] flex-1 truncate">{c.image}</p>
                                    {c.image && (
                                       // eslint-disable-next-line @next/next/no-img-element
                                       <img src={c.image} alt="" className="w-8 h-8 rounded object-cover border border-[#B8975A]/15" />
                                    )}
                                    <button onClick={() => removeColor(c.hex)} className="text-[#5E5F60] hover:text-red-500 transition-colors shrink-0">
                                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                       </svg>
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-[#B8975A]/15 flex items-center justify-between">
               {/* Tab nav */}
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

               {/* Submit */}
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
