"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/Types/Collection/CollectionTypes";
import UpdateProductModal from "@/components/Modal/UpdateProductModal";
import { useProductForm } from "@/Validations/Useproductform";
import { useGetSingleProductHandler } from "@/modals/ProductModal";
import { useDetectCountryHandler } from "@/modals/PaymentModal";

// ── Helpers ───────────────────────────────────────────────────────────────────
type PriceEntry = {
   region?: any; // object (product level) ya string id (accessories)
   price?: number;
   discountMode?: string;
   discountValue?: number;
};

// Region ke hisab se price entry nikalo (code ya id match), warna pehli entry
function pickPrice(list: PriceEntry[] | undefined, regionCode: string, regionId: string): PriceEntry | undefined {
   if (!list || list.length === 0) return undefined;
   const match = list.find((e) => {
      if (!e.region) return false;
      if (typeof e.region === "object") return e.region.code === regionCode;
      return regionId !== "" && e.region === regionId;
   });
   return match ?? list[0];
}

function calcPrice(entry?: PriceEntry) {
   const original = Number(entry?.price ?? 0);
   const discountValue = Number(entry?.discountValue ?? 0);
   const mode = String(entry?.discountMode ?? "").toLowerCase();
   const isPercentage = mode === "percentage" || mode === "percent";
   const raw = discountValue > 0 ? (isPercentage ? Math.round((original * discountValue) / 100) : discountValue) : 0;
   const discountAmount = Math.min(raw, original);
   return {
      original,
      discountAmount,
      percent: original > 0 ? Math.round((discountAmount / original) * 100) : 0,
      hasDiscount: discountAmount > 0,
      final: original - discountAmount,
   };
}

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock?: number }) {
   const s = stock ?? 0;
   if (s === 0) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">Out of Stock</span>;
   if (s <= 5) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Low Stock — {s}</span>;
   return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">In Stock — {s}</span>;
}

export const selectCls = (error?: string) =>
   `w-2/4 px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border rounded-lg text-headingColor focus:outline-none transition-colors cursor-pointer
   ${error ? "border-red-400" : "border-[#B8975A]/20 focus:border-[#B8975A]/60"}`;

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <div className="flex items-center justify-between py-3 border-b border-[#B8975A]/8 last:border-0">
         <p className="text-[11px] tracking-widest uppercase text-[#5E5F60] font-medium w-32 shrink-0">{label}</p>
         <div className="flex-1 text-right">{children}</div>
      </div>
   );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SingleProductPage() {
   const [editOpen, setEditOpen] = useState(false);
   const [activeImage, setActiveImage] = useState<string>("");
   const [activeColor, setActiveColor] = useState(0);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [countryCode, setCountryCode] = useState<string>("");
   const [selectedMaterial, setSelectedMaterial] = useState<string>("");

   const router = useRouter();
   const params = useParams();
   const id = params?.id ?? "";

   // ---------- Handle API -------------
   const { location: detectedLocation } = useDetectCountryHandler();

   const { data, isError, isLoading } = useGetSingleProductHandler({ id: (id as string) ?? "" });
   console.log(data);
   useEffect(() => {
      if (detectedLocation) {
         if (!detectedLocation.isPakistan) {
            setCountryCode("GB");
         } else {
            setCountryCode(detectedLocation.countryCode || "GB");
         }
      }
   }, [detectedLocation]);

   const product: Product | undefined = data?.product;
   const p = product as any;

   const isVariable: boolean = !!p?.isVariable;
   const variants: any[] = p?.variants ?? [];

   // Variable product: pehla material default select
   useEffect(() => {
      if (isVariable && variants.length > 0) {
         setSelectedMaterial(variants[0]?.material ?? "");
      } else {
         setSelectedMaterial("");
      }
      setActiveColor(0);
      setActiveImage("");
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [p?._id, isVariable]);

   const selectedVariant: any = useMemo(() => {
      if (!isVariable || variants.length === 0) return undefined;
      return variants.find((v) => v.material === selectedMaterial) ?? variants[0];
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isVariable, variants, selectedMaterial]);

   // ---------- Region ----------
   const regionCode = countryCode || "GB";

   // Region id nikalo (accessories me region sirf id hoti hai)
   const regionId: string = useMemo(() => {
      const all: PriceEntry[] = [...(p?.pricing ?? []), ...variants.flatMap((v) => v?.price ?? [])];
      const found = all.find((e) => e.region && typeof e.region === "object" && e.region.code === regionCode);
      return found?.region?._id ?? "";
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [p, regionCode]);

   // ---------- Price ----------
   // Variable => selected variant ka price, Non-variable => product.pricing
   const priceList: PriceEntry[] = isVariable ? (selectedVariant?.price ?? []) : (p?.pricing ?? []);
   const priceInfo = pickPrice(priceList, regionCode, regionId);
   const { original: originalPrice, hasDiscount, percent: discountPercent, final: finalPrice } = calcPrice(priceInfo);
   const currency: string = priceInfo?.region?.currency ?? (regionCode === "PK" ? "Rs" : "£");

   // ---------- Stock ----------
   const stock: number | undefined = isVariable && selectedVariant?.stock !== undefined ? selectedVariant.stock : p?.stock;

   // ---------- Colors (sirf variable product) ----------
   const colors: any[] = isVariable ? (selectedVariant?.colors ?? []) : [];
   const getColorImages = (color: any): string[] => color?.images ?? (color?.image ? [color.image] : []);
   const colorImages: string[] = getColorImages(colors[activeColor]);

   // ---------- Images ----------
   const baseImages: string[] = [...(p?.images ?? []), ...(p?.gallery ?? [])];
   const fallbackThumb: string[] = baseImages.length === 0 ? (p?.thumbnail ?? []) : [];
   const allThumbnails: string[] = [...colorImages, ...baseImages, ...fallbackThumb].filter((img, idx, arr) => img && arr.indexOf(img) === idx);
   const displayImage = activeImage || allThumbnails[0] || "";

   const { errors } = useProductForm(() => {});

   const accessories: any[] = p?.accessories ?? [];

   // ── Loading (pehle check karo) ────────────────────────────────────────────
   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-32">
            <svg className="animate-spin text-[#B8975A]/30" width="48" height="48" viewBox="0 0 48 48" fill="none">
               <path d="M24 4a20 20 0 1 0 20 20A20.022 20.022 0 0 0 24 4Zm0 36a16 16 0 1 1 16-16 16.019 16.019 0 0 1-16 16Z" fill="currentColor" />
               <path d="M26.828 6.343a1.5 1.5 0 1 0-2.121-2.121l-3.536 3.536a1.5 1.5 0 1 0 2.121 2.121Z" fill="currentColor" />
               <path d="M24 10a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 3 0v-6A1.5 1.5 0 0 0 24 10Z" fill="currentColor" />
            </svg>
         </div>
      );
   }

   // ── Not found ─────────────────────────────────────────────────────────────
   if (!product || isError) {
      return (
         <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg className="text-[#B8975A]/30 mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
               <path d="M8 14l4 24h24l4-24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
               <path d="M4 14h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] font-medium text-headingColor">Product not found</p>
            <p className="text-[12px] text-[#5E5F60] mt-1">ID: {id}</p>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 text-[12px] text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors">
               ← Go Back
            </button>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-6">
         {/* ── Top bar ── */}
         <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[#5E5F60] hover:text-headingColor transition-colors">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L6 8l4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               Back to Products
            </button>
            <div className="flex items-center gap-3">
               {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                     <p className="text-[12px] text-[#5E5F60]">Are you sure?</p>
                     <button onClick={() => router.back()} className="px-3 py-2 text-[12px] text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Yes, Delete
                     </button>
                     <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor transition-colors">
                        Cancel
                     </button>
                  </div>
               ) : (
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 4h9M5 4V2.5h3V4M4 4l.5 6.5h4L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                     Delete
                  </button>
               )}
               <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  Edit Product
               </button>
            </div>
         </div>

         {/* ── Main content ── */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Left: Images ── */}
            <div className="flex flex-col gap-3">
               <div className="relative bg-staticSecondaryBG rounded-2xl overflow-hidden border border-[#B8975A]/15 aspect-square">
                  {displayImage ? (
                     <Image unoptimized src={displayImage} alt={product.name ?? "Product"} fill className="object-contain" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <svg className="text-[#B8975A]/30" width="48" height="48" viewBox="0 0 48 48" fill="none">
                           <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
                           <path d="M4 32l10-10 8 8 6-6 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </div>
                  )}
                  {product.badge && <span className="absolute top-4 left-4 bg-primaryBG text-[#B8975A] text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-full">{product.badge}</span>}
               </div>

               {allThumbnails.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                     {allThumbnails.map((img, i) => (
                        <button
                           key={`${img}-${i}`}
                           onClick={() => setActiveImage(img)}
                           className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0
                              ${displayImage === img ? "border-[#B8975A]" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                           <Image unoptimized src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* ── Right: Details ── */}
            <div className="flex flex-col gap-5">
               {/* Name + slug */}
               <div>
                  <h1 className="font-serif text-[28px] font-semibold text-headingColor tracking-[0.02em] leading-tight">{product.name}</h1>
                  <p className="text-[12px] text-[#5E5F60] font-mono mt-1">/{product.slug}</p>
               </div>

               {/* Price section */}
               <div className="bg-staticSecondaryBG rounded-xl p-4 border border-[#B8975A]/15 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-1">Price</p>
                     {priceInfo ? (
                        <p className={`font-serif text-[26px] font-semibold leading-none ${hasDiscount ? "text-[#5E5F60] line-through" : "text-headingColor"}`}>
                           {currency} {originalPrice.toLocaleString()}
                        </p>
                     ) : (
                        <p className="text-[13px] text-[#5E5F60]">Price not set</p>
                     )}
                  </div>

                  {hasDiscount && (
                     <div className="text-right">
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-1">After Discount</p>
                        <div className="flex items-center gap-2 justify-end">
                           <p className="font-serif text-[22px] font-semibold text-green-700 leading-none">
                              {currency} {finalPrice.toLocaleString()}
                           </p>
                           <span className="text-[11px] bg-primaryBG text-[#B8975A] px-2 py-0.5 rounded">-{discountPercent}%</span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Details card */}
               <div className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/15 px-4">
                  <InfoRow label="Type">
                     <span className="text-[11px] bg-primaryBG text-[#B8975A] px-2.5 py-1 rounded-full">{isVariable ? "Variable" : "Simple"}</span>
                  </InfoRow>
                  <InfoRow label="Stock">
                     <StockBadge stock={stock} />
                  </InfoRow>

                  {/* Materials — sirf variable product me */}
                  {isVariable && variants.length > 0 && (
                     <InfoRow label="Materials">
                        <select
                           value={selectedMaterial}
                           className={selectCls((errors as any)?.singleMaterial)}
                           onChange={(e) => {
                              setSelectedMaterial(e.target.value);
                              setActiveColor(0);
                              setActiveImage("");
                           }}
                        >
                           {variants.map((m) => (
                              <option key={m.material} value={m.material}>
                                 {m.material}
                              </option>
                           ))}
                        </select>
                     </InfoRow>
                  )}

                  <InfoRow label="Category">
                     {(p?.categories?.length ?? 0) > 0 ? (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                           {p.categories.map((c: any) => (
                              <span key={c._id} className="text-[11px] bg-[#B8975A]/10 text-[#B8975A] px-2.5 py-1 rounded-full">
                                 {c.name}
                              </span>
                           ))}
                        </div>
                     ) : (
                        <p className="text-[12px] text-[#5E5F60]">None</p>
                     )}
                  </InfoRow>
                  <InfoRow label="Badge">{product.badge ? <span className="text-[11px] bg-primaryBG text-[#B8975A] px-2.5 py-1 rounded-full">{product.badge}</span> : <p className="text-[12px] text-[#5E5F60]">None</p>}</InfoRow>
                  <InfoRow label="ID">
                     <p className="text-[11px] text-[#5E5F60] font-mono">{product._id}</p>
                  </InfoRow>
               </div>

               {/* Description */}
               {p?.description && (
                  <div className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/15 p-4">
                     <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-2">Description</p>
                     <p className="text-[13px] text-headingColor leading-relaxed">{p.description}</p>
                  </div>
               )}

               {/* Color variants — sirf variable product me */}
               {colors.length > 0 && (
                  <div>
                     <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Color Variants ({colors.length})</p>
                     <div className="flex flex-col gap-2">
                        {colors.map((color, i) => {
                           const imgs = getColorImages(color);
                           return (
                              <button
                                 key={`${color?.hex?.code}-${i}`}
                                 onClick={() => {
                                    setActiveColor(i);
                                    setActiveImage(imgs[0] ?? "");
                                 }}
                                 className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                                    ${activeColor === i ? "border-[#B8975A] bg-[#B8975A]/5" : "border-[#B8975A]/15 bg-staticSecondaryBG hover:border-[#B8975A]/30"}`}
                              >
                                 <div className="w-8 h-8 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color?.hex?.code }} />
                                 <div className="flex-1 text-left">
                                    <p className="text-[12px] font-mono text-[#5E5F60]">{color?.hex?.colorName || color?.hex?.code}</p>
                                    <p className="text-[10px] text-[#5E5F60]/70 mt-0.5">
                                       {imgs.length} image{imgs.length !== 1 ? "s" : ""}
                                    </p>
                                 </div>
                                 <div className="flex gap-1 ml-auto">
                                    {imgs.slice(0, 3).map((img, j) => (
                                       <div key={j} className="w-9 h-9 rounded-lg overflow-hidden border border-[#B8975A]/15 shrink-0">
                                          <Image unoptimized src={img} alt="" width={36} height={36} className="w-full h-full object-cover" />
                                       </div>
                                    ))}
                                    {imgs.length > 3 && (
                                       <div className="w-9 h-9 rounded-lg bg-[#B8975A]/10 flex items-center justify-center shrink-0">
                                          <p className="text-[10px] text-[#B8975A] font-medium">+{imgs.length - 3}</p>
                                       </div>
                                    )}
                                 </div>
                                 {activeColor === i && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#B8975A]">
                                       <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 )}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* ── Accessories ── */}
         {accessories.length > 0 && (
            <div>
               <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Accessories ({accessories.length})</p>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {accessories.map((acc) => {
                     // Accessory simple ho to pricing, variable ho to pehle variant ka price
                     const accList: PriceEntry[] = (acc.pricing?.length ?? 0) > 0 ? acc.pricing : (acc.variants?.[0]?.price ?? []);
                     const accPrice = calcPrice(pickPrice(accList, regionCode, regionId));
                     const accThumb: string | undefined = acc.thumbnail?.[0] ?? acc.variants?.[0]?.colors?.[0]?.images?.[0];
                     return (
                        <div key={acc._id} className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/15 overflow-hidden">
                           <div className="relative aspect-square bg-[#F5F0E8]">{accThumb ? <Image unoptimized src={accThumb} alt={acc.name ?? ""} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[11px] text-[#5E5F60]">No image</div>}</div>
                           <div className="p-3">
                              <p className="text-[13px] font-medium text-headingColor truncate">{acc.name}</p>
                              <p className="text-[10px] text-[#5E5F60] font-mono truncate">/{acc.slug}</p>
                              {accList.length > 0 ? (
                                 <div className="flex items-center gap-2 mt-1.5">
                                    <p className={`text-[12px] font-semibold ${accPrice.hasDiscount ? "text-[#5E5F60] line-through" : "text-headingColor"}`}>
                                       {currency} {accPrice.original.toLocaleString()}
                                    </p>
                                    {accPrice.hasDiscount && (
                                       <p className="text-[12px] font-semibold text-green-700">
                                          {currency} {accPrice.final.toLocaleString()}
                                       </p>
                                    )}
                                 </div>
                              ) : (
                                 <p className="text-[11px] text-[#5E5F60] mt-1.5">Price not set</p>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {/* ── Edit Modal (pre-filled) ── */}
         <UpdateProductModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            initialData={product}
            onSuccess={() => {
               setEditOpen(false);
            }}
         />
      </div>
   );
}
