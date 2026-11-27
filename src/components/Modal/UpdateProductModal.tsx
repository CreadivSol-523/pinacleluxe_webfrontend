"use client";

import { useState, useRef, useEffect } from "react";
import { useProductForm, DiscountMode, ColorVariant, RegionPrice, RegionPriceDraft } from "@/Validations/Useproductform";
import { Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import { Region } from "@/Types/Region/Region";
import { useGetRegionHandler } from "@/modals/RegionModal";
import { Category } from "@/Types/Category/Category";
import { MediaItem } from "@/lib/uploadImages";
import AccessoriesSection from "../Cards/AccessoriesCard/AccessoriesSection";

const toRegionPriceArray = (prices: any[] = []): RegionPrice[] =>
   (prices ?? []).map((r) => ({
      region: {
         _id: r._id ?? r.region?._id ?? "",
         name: r.region?.name ?? r.region ?? "",
         code: r.code ?? r.region?.code ?? "",
         currency: r.region?.currency ?? "",
         description: r.region?.description ?? "",
         isActive: r.region?.isActive ?? true,
      },
      price: r.price,
      discountMode: r.discountMode,
      discountValue: r.discountValue,
   }));

// Purani (already saved) URL string ko "done" MediaItem bana do, taake naye UI mein chale
const toDoneItem = (url: string): MediaItem => ({ id: url, preview: url, status: "done", progress: 100, url }) as MediaItem;

// string ya MediaItem, dono se image dikhane ka src
const imgSrc = (x: any): string => (typeof x === "string" ? x : (x?.preview ?? x?.url ?? ""));

interface UpdateProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: (product: any) => void;
   initialData?: Product;
   categoryData?: Category[];
}

type Tab = "basic" | "media" | "variants" | "accessories";

const tabs: { key: Tab; label: string }[] = [
   { key: "basic", label: "Basic Info" },
   { key: "media", label: "Images" },
   { key: "variants", label: "Variants" },
   { key: "accessories", label: "Accessories" },
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

export const selectCls = (error?: string) =>
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

// ── Media tile: image + neeche progress bar + cross ──────────────────────────
// string (purani URL) ko bhi "done" item ki tarah handle karta hai
const normalizeItem = (x: MediaItem | string): MediaItem => (typeof x === "string" ? ({ id: x, preview: x, status: "done", progress: 100 } as MediaItem) : x);

function MediaTile({ item, onRemove, onRetry, label, compact = false }: { item: MediaItem | string; onRemove: () => void; onRetry: (id: string) => void; label?: string; compact?: boolean }) {
   const it = normalizeItem(item);

   return (
      <div className="flex flex-col gap-1">
         <div className="relative rounded-lg overflow-hidden bg-[#F5F0E8] aspect-square border border-[#B8975A]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.preview} alt="" className={`w-full h-full object-cover transition-opacity ${it.status === "uploading" ? "opacity-60" : ""} ${it.status === "error" ? "opacity-30" : ""}`} />
            <button type="button" onClick={onRemove} title={it.status === "uploading" ? "Cancel upload" : "Remove image"} className={`absolute top-1 right-1 rounded-full bg-red-500 text-white flex items-center justify-center ${compact ? "w-4 h-4" : "w-5 h-5"}`}>
               <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
               </svg>
            </button>
            {label && <span className="absolute bottom-1 left-1 text-[9px] bg-primaryBG text-[#B8975A] px-1.5 py-0.5 rounded leading-none">{label}</span>}
         </div>

         {it.status === "uploading" && (
            <div>
               <div className="w-full h-1 bg-[#B8975A]/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B8975A] transition-all duration-150" style={{ width: `${it.progress}%` }} />
               </div>
               <p className="text-[9px] text-[#5E5F60] mt-0.5 text-right">{it.progress}%</p>
            </div>
         )}

         {it.status === "error" && (
            <div className="flex items-center justify-between gap-1">
               <span className="text-[9px] text-red-500">Failed</span>
               <button type="button" onClick={() => onRetry(it.id)} className="text-[9px] text-[#B8975A] underline">
                  Retry
               </button>
            </div>
         )}
      </div>
   );
}

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({
   label,
   items,
   onAdd,
   onRemove,
   onRetry,
   error,
   firstLabel,
   multiple = true,
}: {
   label: string;
   items: (MediaItem | string)[];
   onAdd: (url: string, file?: File) => void;
   onRemove: (i: number) => void;
   onRetry: (id: string) => void;
   error?: string;
   firstLabel?: string;
   multiple?: boolean;
}) {
   const fileRef = useRef<HTMLInputElement>(null);

   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      (multiple ? files : files.slice(0, 1)).forEach((file) => onAdd(URL.createObjectURL(file), file));
      e.target.value = "";
   };

   return (
      <div>
         <Label>{label}</Label>
         {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}
         <div className="flex gap-2 mb-2">
            <button
               type="button"
               onClick={() => fileRef.current?.click()}
               className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[#B8975A]/20 bg-[#F5F0E8] text-[12px] text-[#5E5F60] rounded-lg w-full hover:border-[#B8975A]/50 hover:text-headingColor transition-colors whitespace-nowrap"
            >
               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
               </svg>
               Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFile} />
         </div>
         {items.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
               {items.map((item, i) => (
                  <MediaTile key={normalizeItem(item).id} item={item} onRemove={() => onRemove(i)} onRetry={onRetry} label={i === 0 ? firstLabel : undefined} />
               ))}
            </div>
         )}
      </div>
   );
}

// ── Region Price Section ──────────────────────────────────────────────────────
function RegionPriceSection({
   regionDraft,
   setRegionDraftField,
   addRegionPrice,
   removeRegionPrice,
   addedPrices,
   errors,
   target,
}: {
   regionDraft: RegionPriceDraft;
   setRegionDraftField: (key: keyof RegionPriceDraft, value: RegionPriceDraft[keyof RegionPriceDraft]) => void;
   addRegionPrice: (target: "single" | "draft") => void;
   removeRegionPrice: (target: "single" | "draft", region: string) => void;
   addedPrices: RegionPrice[];
   errors: { regionRegion?: string; regionPrice?: string };
   target: "single" | "draft";
}) {
   // Region list ab API se aati hai (Region object), plain text input nahi
   const { data } = useGetRegionHandler();
   const regions = data?.regions || [];

   return (
      <div className="flex flex-col gap-3">
         <p className="text-[11px] font-medium text-headingColor tracking-[0.04em]">Region Pricing *</p>

         <div className="bg-staticSecondaryBG rounded-lg p-3 flex flex-col gap-3 border border-[#B8975A]/10">
            <div className="grid grid-cols-2 gap-3">
               <div>
                  <Label>Region</Label>
                  <select
                     value={regionDraft.region?._id ?? ""}
                     onChange={(e) => {
                        const selectedRegion = regions.find((r) => r._id === e.target.value);
                        if (!selectedRegion) return;
                        setRegionDraftField("region", {
                           _id: selectedRegion._id,
                           name: selectedRegion.name,
                           currency: selectedRegion.currency,
                           description: selectedRegion.description,
                           isActive: selectedRegion.isActive,
                           code: selectedRegion.code,
                        } as any);
                     }}
                     className={selectCls(errors.regionRegion)}
                  >
                     <option value="">Select region...</option>
                     {regions.map((m) => (
                        <option key={m._id} value={m._id}>
                           {m.name}
                        </option>
                     ))}
                  </select>
                  {errors.regionRegion && <p className="text-[11px] text-red-500 mt-1">{errors.regionRegion}</p>}
               </div>
               <div>
                  <Label>Price *</Label>
                  <FieldInput type="number" value={regionDraft.price} onChange={(v) => setRegionDraftField("price", v ? Number(v) : undefined)} placeholder="11000" error={errors.regionPrice} />
               </div>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex border border-[#B8975A]/25 rounded-md overflow-hidden text-[11px]">
                  {(["static", "percentage"] as DiscountMode[]).map((m) => (
                     <button key={m} onClick={() => setRegionDraftField("discountMode", m)} className={`px-3 py-1.5 transition-colors ${regionDraft.discountMode === m ? "bg-[#B8975A] text-white" : "text-[#5E5F60] hover:text-headingColor"}`}>
                        {m === "static" ? "Rs Off" : "% Off"}
                     </button>
                  ))}
               </div>
               <div className="flex-1">
                  <FieldInput type="number" value={regionDraft.discountValue} onChange={(v) => setRegionDraftField("discountValue", v ? Number(v) : undefined)} placeholder={regionDraft.discountMode === "percentage" ? "e.g. 10" : "e.g. 500"} />
               </div>
               {regionDraft.discountValue && regionDraft.price ? (
                  <span className="text-[11px] text-[#5E5F60] whitespace-nowrap">
                     = {regionDraft.discountMode === "percentage" ? Math.round(regionDraft.price - (regionDraft.price * regionDraft.discountValue) / 100).toLocaleString() : Math.round(regionDraft.price - regionDraft.discountValue).toLocaleString()}
                  </span>
               ) : null}
            </div>

            <button onClick={() => addRegionPrice(target)} className="w-full py-2 text-[11px] font-medium text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/10 transition-colors">
               + Add Region
            </button>
         </div>

         {addedPrices.length > 0 && (
            <div className="flex flex-col gap-1.5">
               {addedPrices.map((r) => (
                  <div key={r.region._id} className="flex items-center justify-between px-3 py-2 bg-[#F5F0E8] rounded-lg border border-[#B8975A]/10">
                     <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] font-medium text-[#B8975A] uppercase tracking-widest">{r.region.code}</span>
                        <span className="text-[12px] text-headingColor">
                           {r?.region?.currency || "Rs"} {r.price?.toLocaleString()}
                        </span>
                        {r.discountValue && (
                           <span className="text-[11px] text-[#5E5F60]">
                              -{r.discountMode === "percentage" ? `${r.discountValue}%` : `${r?.region?.currency || "Rs"} ${r.discountValue.toLocaleString()}`}
                              {" → "}
                              {r.discountMode === "percentage" ? Math.round(r.price - (r.price * r.discountValue) / 100).toLocaleString() : Math.round(r.price - r.discountValue).toLocaleString()}
                           </span>
                        )}
                     </div>
                     <button onClick={() => removeRegionPrice(target, r.region._id)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                           <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

// ── Color Section ─────────────────────────────────────────────────────────────
function ColorSection({
   colorDraft,
   setColorDraft,
   addColorImage,
   removeColorImage,
   onRetryImage,
   onAddColor,
   onRemoveColor,
   onRemoveColorImage,
   addedColors,
   errors,
}: {
   colorDraft: ColorVariant;
   setColorDraft: React.Dispatch<React.SetStateAction<ColorVariant>>;
   addColorImage: (url: string, file?: string | File) => void;
   removeColorImage: (i: number) => void;
   onRetryImage: (id: string) => void;
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
                  <input type="color" value={colorDraft.hex.code} onChange={(e) => setColorDraft((p) => ({ ...p, hex: { ...p.hex, code: e.target.value } }))} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                  <div className="w-full h-full rounded-lg" style={{ backgroundColor: colorDraft.hex.code }} />
               </div>
               <p className="text-[9px] text-[#5E5F60] font-mono">{colorDraft.hex.code}</p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
               <input
                  type="text"
                  value={colorDraft.hex.colorName}
                  onChange={(e) => setColorDraft((p) => ({ ...p, hex: { ...p.hex, colorName: e.target.value } }))}
                  placeholder="Color name (e.g. Midnight Black)"
                  className="w-full px-3 py-1.5 text-[12px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
               />
               <p className="text-[10px] text-[#5E5F60]">Add images then click Add Swatch</p>
            </div>
            {errors.colorHex && <p className="text-[10px] text-red-500">{errors.colorHex}</p>}
         </div>

         {/* Color image upload */}
         <div>
            <div className="flex gap-2 mb-1.5">
               <label className="flex items-center gap-1 px-3 py-2 border w-full justify-center border-[#B8975A]/20 bg-staticSecondaryBG text-[12px] text-[#5E5F60] rounded-lg hover:border-[#B8975A]/50 cursor-pointer transition-colors whitespace-nowrap">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M6.5 9V2M3.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                     <path d="M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Upload Image
                  <input
                     type="file"
                     accept="image/*"
                     multiple
                     className="hidden"
                     onChange={(e) => {
                        Array.from(e.target.files || []).forEach((f) => addColorImage(URL.createObjectURL(f), f));
                        e.target.value = "";
                     }}
                  />
               </label>
            </div>
            {errors.colorImage && <p className="text-[10px] text-red-500 mb-1">{errors.colorImage}</p>}
            {(colorDraft.images?.length ?? 0) > 0 && (
               <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {(colorDraft.images as any[]).map((img, i) => (
                     <MediaTile key={normalizeItem(img).id} item={img} compact onRemove={() => removeColorImage(i)} onRetry={onRetryImage} label={i === 0 ? "Main" : undefined} />
                  ))}
               </div>
            )}
         </div>

         <button type="button" onClick={onAddColor} className="w-full py-2 border border-dashed border-[#B8975A]/40 text-[#B8975A] text-[12px] rounded-lg hover:bg-[#B8975A]/5 transition-colors">
            + Add Color Swatch
         </button>

         {/* Added colors list */}
         {addedColors.length > 0 && (
            <div className="flex flex-col gap-2">
               <p className="text-[10px] tracking-widest uppercase text-[#5E5F60]">Added ({addedColors.length})</p>
               {addedColors.map((c) => (
                  <div key={c.hex.code} className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/10 overflow-hidden">
                     <div className="flex items-center gap-3 px-3 py-2 border-b border-[#B8975A]/10">
                        <div className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex.code }} />
                        <p className="text-[11px] font-mono text-[#5E5F60] flex-1">
                           {c.hex.colorName && <span className="font-medium text-headingColor not-italic">{c.hex.colorName} · </span>}
                           {c.hex.code}
                        </p>
                        <p className="text-[11px] text-[#5E5F60]">
                           {c.images?.length ?? 0} img{(c.images?.length ?? 0) !== 1 ? "s" : ""}
                        </p>
                        <button type="button" onClick={() => onRemoveColor(c.hex.code)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                           <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                           </svg>
                        </button>
                     </div>
                     <div className="p-2 grid grid-cols-5 gap-1.5">
                        {((c.images ?? []) as any[]).map((img, i) => (
                           <MediaTile key={normalizeItem(img).id + i} item={img} compact onRemove={() => onRemoveColorImage(c.hex.code, i)} onRetry={onRetryImage} />
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

// ── Variant Card ──────────────────────────────────────────────────────────────
function VariantCard({
   variant,
   onRemove,
   onEdit,
   onRemoveColor,
   onRemoveColorImage,
   onRemoveRegion,
}: {
   variant: VariantSchema;
   onRemove: () => void;
   onEdit: () => void;
   onRemoveColor: (hex: string) => void;
   onRemoveColorImage: (hex: string, i: number) => void;
   onRemoveRegion: (region: string) => void;
}) {
   const [expanded, setExpanded] = useState(false);
   const hasColors = (variant.colors?.length ?? 0) > 0;
   const hasPrices = (variant.price?.length ?? 0) > 0;

   return (
      <div className="bg-[#F5F0E8] rounded-xl border border-[#B8975A]/10 overflow-hidden">
         {/* Header */}
         <div className="flex items-center gap-3 px-3.5 py-3">
            <div className="flex-1 flex items-center gap-3 flex-wrap">
               <span className="text-[12px] font-medium text-headingColor">{variant.material}</span>
               {hasPrices && <span className="text-[11px] text-[#5E5F60]">{variant.price.map((r: any) => r.code).join(", ")}</span>}
            </div>
            {hasColors && (
               <button onClick={() => setExpanded((p) => !p)} className="flex items-center gap-1 text-[11px] text-[#5E5F60] hover:text-headingColor transition-colors">
                  {variant.colors!.length} color{variant.colors!.length !== 1 ? "s" : ""}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}>
                     <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            )}
            <button onClick={onEdit} title="Edit variant" className="text-[#5E5F60] hover:text-[#B8975A] transition-colors shrink-0">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </button>
            <button onClick={onRemove} title="Remove variant" className="text-[#5E5F60] hover:text-red-500 transition-colors shrink-0">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
               </svg>
            </button>
         </div>

         {/* Region prices */}
         {hasPrices && (
            <div className="border-t border-[#B8975A]/10 px-3.5 py-2.5 flex flex-col gap-1.5">
               {variant.price.map((r: any, i) => (
                  <div key={(r._id ?? r.region?._id ?? "") + i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-medium text-[#B8975A] uppercase tracking-widest">{r.code}</span>
                        <span className="text-[12px] text-headingColor">
                           {r.region?.currency || "Rs"} {r.price?.toLocaleString()}
                        </span>
                        {r.discountValue && (
                           <span className="text-[11px] text-[#5E5F60]">
                              -{r.discountMode === "percentage" ? `${r.discountValue}%` : `${r.region?.currency || "Rs"} ${r.discountValue.toLocaleString()}`}
                              {" → "}
                              {r.discountMode === "percentage" ? Math.round(r.price - (r.price * r.discountValue) / 100).toLocaleString() : Math.round(r.price - r.discountValue).toLocaleString()}
                           </span>
                        )}
                     </div>
                     <button onClick={() => onRemoveRegion(r._id)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                           <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                     </button>
                  </div>
               ))}
            </div>
         )}

         {/* Colors expanded */}
         {expanded && hasColors && (
            <div className="border-t border-[#B8975A]/10 p-2.5 flex flex-col gap-2">
               {variant.colors!.map((c) => (
                  <div key={c.hex.code} className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/10 overflow-hidden">
                     <div className="flex items-center gap-2 px-3 py-2 border-b border-[#B8975A]/10">
                        <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c.hex.code }} />
                        <p className="text-[11px] text-[#5E5F60] flex-1">
                           {c.hex.colorName && <span className="font-medium text-headingColor">{c.hex.colorName} · </span>}
                           <span className="font-mono">{c.hex.code}</span>
                        </p>
                        <button onClick={() => onRemoveColor(c.hex.code)} className="text-[#5E5F60] hover:text-red-500 transition-colors">
                           <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                           </svg>
                        </button>
                     </div>
                     <div className="p-2 grid grid-cols-5 gap-1.5">
                        {((c.images ?? []) as any[]).map((img, i) => (
                           <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#B8975A]/10 bg-[#F5F0E8]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgSrc(img)} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => onRemoveColorImage(c.hex.code, i)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
export default function UpdateProductModal({ isOpen, onClose, onSuccess, initialData, categoryData }: UpdateProductModalProps) {
   const [activeTab, setActiveTab] = useState<Tab>("basic");
   const overlayRef = useRef<HTMLDivElement>(null);

   const {
      form,
      errors,
      loading,
      mediaBusy,
      submitError,
      setField,
      handleNameChange,
      handleCategoryChange,
      handleVariableToggle,
      addImage,
      removeImage,
      retryUpload,
      // single
      singleVariant,
      setSingleField,
      // multi
      variantDraft,
      setVariantDraftField,
      addVariant,
      removeVariant,
      removeColorFromVariant,
      removeColorVariantImage,
      removeColorFromVariantDraft,
      removeColorImageFromVariantDraft,
      removeRegionFromVariant,
      // region price
      regionDraft,
      setRegionDraftField,
      addRegionPrice,
      removeRegionPrice,
      // color draft
      colorDraft,
      setColorDraft,
      addColorImage,
      removeColorImage,
      addColorToTarget,
      // accessories
      toggleAccessory,
      // misc
      handleSubmit,
      reset,
      setForm,
      subCategories,
      BADGES,
      CATEGORY_TREE,
   } = useProductForm((product) => {
      onSuccess?.(product);
      onClose();
   });

   // ── Populate form with initialData ────────────────────────────────────────
   useEffect(() => {
      if (!initialData && !isOpen) return;

      const oldThumbs = (((initialData as unknown as { thumbnail: string[] })?.thumbnail as unknown as string[]) ?? []).filter((u): u is string => typeof u === "string");
      const oldGallery = ((initialData?.images as unknown as string[]) ?? []).filter((u): u is string => typeof u === "string");

      setForm({
         _id: initialData?._id ?? "",
         name: initialData?.name ?? "",
         slug: initialData?.slug ?? "",
         badge: initialData?.badge ?? "",
         stock: initialData?.stock ?? 0,
         description: initialData?.description ?? "",
         categories: (initialData as any)?.categories?.[0]?.parentId ? (initialData as any)?.categories?.[0]?.parentId : ((initialData as any)?.categories?.[0]?._id ?? ""),
         subCategory: (initialData as any)?.categories?.[0]?._id ?? "",
         isVariable: initialData?.isVariable ?? false,
         // purani saved images "done" MediaItem ban kar aati hain (publicId nahi, to Cloudinary se delete nahi hongi)
         images: oldThumbs.map(toDoneItem),
         gallery: oldGallery.map(toDoneItem),
         variants: initialData?.variants ?? [],
         // accessories ids ki array (populated objects hon ya sirf ids, dono handle)
         accessories: ((initialData as any)?.accessories ?? []).map((a: any) => (typeof a === "string" ? a : a._id)),
      } as any);

      if (!initialData?.isVariable) {
         setSingleField("price", toRegionPriceArray((initialData as any)?.pricing));
      }
   }, [initialData?._id, isOpen]);

   const handleEditVariant = (v: VariantSchema) => {
      const anyV = v as any;
      setVariantDraftField("material", anyV.material ?? "");
      setVariantDraftField("price", toRegionPriceArray(anyV.price));
      // colors ki purani image strings ko MediaItem bana do
      setVariantDraftField(
         "colors",
         (anyV.colors ?? []).map((c: any) => ({
            ...c,
            images: (c.images ?? []).map((img: any) => (typeof img === "string" ? toDoneItem(img) : img)),
         })),
      );
      removeVariant(anyV.material);
   };

   // Save ke dauran Escape se modal band nahi hoga
   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "Escape" && !loading) onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [onClose, loading]);

   if (!isOpen) return null;

   const handleClose = () => {
      if (loading) return; // backend save ke dauran close nahi
      reset(); // in-flight uploads cancel + nayi uploaded images Cloudinary se delete
      onClose();
   };

   const tabIndex = tabs.findIndex((t) => t.key === activeTab);

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
                  <h2 className="font-serif text-[20px] font-semibold text-headingColor tracking-[0.04em]">Update Product</h2>
                  <p className="text-[11px] text-[#5E5F60] mt-0.5">{initialData?.name ?? "Edit product details"}</p>
               </div>
               <button onClick={handleClose} disabled={loading} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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
                     {t.key === "variants" && form.variants.length > 0 && <span className="ml-1.5 text-[10px] bg-[#B8975A]/15 text-[#B8975A] px-1.5 py-0.5 rounded-full">{form.variants.length}</span>}
                     {t.key === "accessories" && (form.accessories?.length ?? 0) > 0 && <span className="ml-1.5 text-[10px] bg-[#B8975A]/15 text-[#B8975A] px-1.5 py-0.5 rounded-full">{form.accessories.length}</span>}
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
                     <div className="flex flex-col gap-4">
                        <div>
                           <Label>Stock *</Label>
                           <FieldInput type="number" value={form.stock} onChange={(v) => setField("stock", parseInt(v))} placeholder="0" error={errors.stock} />
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
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Label>Category *</Label>
                           <select value={form.categories} onChange={(e) => handleCategoryChange(e.target.value)} className={selectCls(errors.categories)}>
                              <option value="">Select category...</option>
                              {CATEGORY_TREE?.map((c) => (
                                 <option key={c._id} value={c._id}>
                                    {c.name}
                                 </option>
                              ))}
                           </select>
                           {errors.categories && <p className="text-[11px] text-red-500 mt-1">{errors.categories}</p>}
                        </div>
                        <div>
                           <Label>Sub-Category</Label>
                           <select value={form.subCategory} onChange={(e) => setField("subCategory", e.target.value)} disabled={!subCategories.length} className={`${selectCls()} disabled:opacity-40 disabled:cursor-not-allowed`}>
                              <option value="">{!form.categories ? "Select category first" : subCategories.length === 0 ? "No subcategories" : "Select sub-category..."}</option>
                              {subCategories.map((s) => (
                                 <option key={s._id} value={s._id}>
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
                     <ImageUploader label="Main Image * (shown on product card)" multiple={false} items={form.images as any[]} onAdd={(url, file) => addImage("images", url, file)} onRemove={(i) => removeImage("images", i)} onRetry={retryUpload} error={errors.images} firstLabel="Main" />
                     <div className="border-t border-[#B8975A]/10" />
                     <ImageUploader label="Gallery Images (shown on hover)" items={form.gallery as any[]} onAdd={(url, file) => addImage("gallery", url, file)} onRemove={(i) => removeImage("gallery", i)} onRetry={retryUpload} />
                  </div>
               )}

               {/* ══ TAB 3: Variants ══ */}
               {activeTab === "variants" && (
                  <div className="flex flex-col gap-6">
                     {/* ── SINGLE MODE ── */}
                     {!form.isVariable && (
                        <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#B8975A]/60" />
                              <p className="text-[11px] text-[#5E5F60]">
                                 Single variant — enable <span className="text-[#B8975A]">Variable Product</span> in Basic Info for multiple
                              </p>
                           </div>

                           <RegionPriceSection
                              regionDraft={regionDraft}
                              setRegionDraftField={setRegionDraftField}
                              addRegionPrice={addRegionPrice}
                              removeRegionPrice={removeRegionPrice}
                              addedPrices={singleVariant.price}
                              errors={{ regionRegion: errors.regionRegion, regionPrice: errors.regionPrice }}
                              target="single"
                           />
                           {errors.singlePrice && <p className="text-[11px] text-red-500 -mt-2">{errors.singlePrice}</p>}
                        </div>
                     )}

                     {/* ── MULTI MODE ── */}
                     {form.isVariable && (
                        <div className="flex flex-col gap-5">
                           <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-4 border border-[#B8975A]/10">
                              <p className="text-[12px] font-medium text-headingColor tracking-[0.04em]">New Variant</p>

                              <div>
                                 <Label>Material *</Label>
                                 <FieldInput type="text" value={variantDraft.material} onChange={(v) => setVariantDraftField("material", v)} placeholder="Enter material..." error={errors.variantMaterial} />
                              </div>

                              <RegionPriceSection
                                 regionDraft={regionDraft}
                                 setRegionDraftField={setRegionDraftField}
                                 addRegionPrice={addRegionPrice}
                                 removeRegionPrice={removeRegionPrice}
                                 addedPrices={variantDraft.price}
                                 errors={{ regionRegion: errors.regionRegion, regionPrice: errors.regionPrice }}
                                 target="draft"
                              />
                              {errors.variantPrice && <p className="text-[11px] text-red-500 -mt-2">{errors.variantPrice}</p>}

                              <ColorSection
                                 colorDraft={colorDraft}
                                 setColorDraft={setColorDraft}
                                 addColorImage={addColorImage}
                                 removeColorImage={removeColorImage}
                                 onRetryImage={retryUpload}
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

                           {errors.variants && <p className="text-[11px] text-red-500 -mt-3">{errors.variants}</p>}

                           {form.variants.length > 0 && (
                              <div className="flex flex-col gap-3">
                                 <p className="text-[10px] tracking-widest uppercase text-[#5E5F60]">Added Variants ({form.variants.length})</p>
                                 {form.variants.map((v) => (
                                    <VariantCard
                                       key={v.material}
                                       variant={v}
                                       onRemove={() => removeVariant(v.material)}
                                       onEdit={() => handleEditVariant(v)}
                                       onRemoveColor={(hex) => removeColorFromVariant(v.material, hex)}
                                       onRemoveColorImage={(hex, i) => removeColorVariantImage(v.material, hex, i)}
                                       onRemoveRegion={(region) => removeRegionFromVariant(v.material, region)}
                                    />
                                 ))}
                              </div>
                           )}

                           {form.variants.length === 0 && (
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

               {/* ══ TAB 4: Accessories ══ */}
               {activeTab === "accessories" && <AccessoriesSection selected={form.accessories ?? []} onToggle={toggleAccessory} categories={CATEGORY_TREE ?? []} excludeId={initialData?._id} />}
            </div>

            {/* Submit error */}
            {submitError && (
               <div className="px-6 pt-3">
                  <p className="text-[11px] text-red-500">{submitError}</p>
               </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#B8975A]/15 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  {tabIndex > 0 && (
                     <button onClick={() => setActiveTab(tabs[tabIndex - 1].key)} className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                     </button>
                  )}
                  {tabIndex < tabs.length - 1 && (
                     <button onClick={() => setActiveTab(tabs[tabIndex + 1].key)} className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors">
                        Next
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  )}
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={handleClose} disabled={loading} className="px-5 py-2.5 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                     Cancel
                  </button>
                  <button
                     onClick={() => handleSubmit({ type: "update" })}
                     disabled={loading || mediaBusy}
                     className="flex items-center gap-2 px-5 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                     {loading || mediaBusy ? (
                        <>
                           <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                           </svg>
                           {loading ? "Saving..." : "Uploading images..."}
                        </>
                     ) : (
                        <>
                           <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                           Update Product
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
