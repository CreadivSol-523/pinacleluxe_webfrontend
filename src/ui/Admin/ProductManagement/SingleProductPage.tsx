"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Products from "@/DummyData/Products.json";
import { Product, VariantSchema } from "@/Types/Collection/CollectionTypes";
import UpdateProductModal from "@/components/Modal/UpdateProductModal";
import { useProductForm } from "@/Validations/Useproductform";

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
   const [selectedMaterials, setSelectedMaterials] = useState<VariantSchema>({
      material: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      colors: [{ hex: "", images: [] }],
   });

   const router = useRouter();
   const params = useParams();
   const id = params?.id;

   const allProducts: Product[] = Products.products;
   const product = useMemo(() => allProducts.find((p) => p.id === id), [allProducts, id]);

   // ── Not found ─────────────────────────────────────────────────────────────
   if (!product) {
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

   useEffect(() => {
      setSelectedMaterials({
         material: product?.VariantSchema?.[0]?.material || "",
         price: product?.VariantSchema?.[0]?.price || 0,
         discountPrice: product?.VariantSchema?.[0]?.discountPrice || 0,
         colors: product?.VariantSchema?.[0]?.colors,
         discountMode: "static",
         stock: product?.VariantSchema?.[0]?.stock,
      });
   }, []);

   // colors[i].images is string[] (multiple images per color)
   const colorImages: string[] = (selectedMaterials?.colors?.[activeColor] as any)?.images ?? ((selectedMaterials?.colors?.[activeColor] as any)?.image ? [(selectedMaterials?.colors?.[activeColor] as any).image] : []);

   // All thumbnails: color images first, then main images, then gallery — all deduped
   const allThumbnails: string[] = [...colorImages, ...(product.images ?? []), ...(product.gallery ?? [])].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

   // Displayed main image
   const displayImage = activeImage || allThumbnails[0] || "";

   const { errors } = useProductForm(() => {});

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
               {/* Delete */}
               {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                     <p className="text-[12px] text-[#5E5F60]">Are you sure?</p>
                     <button
                        onClick={() => {
                           console.log("Delete product", id);
                           router.back();
                        }}
                        className="px-3 py-2 text-[12px] text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                     >
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
               {/* Edit */}
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
               {/* Main image */}
               <div className="relative bg-staticSecondaryBG rounded-2xl overflow-hidden border border-[#B8975A]/15 aspect-square">
                  {displayImage ? (
                     <Image src={displayImage} alt={product.name ?? "Product"} fill className="object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <svg className="text-[#B8975A]/30" width="48" height="48" viewBox="0 0 48 48" fill="none">
                           <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
                           <path d="M4 32l10-10 8 8 6-6 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </div>
                  )}
                  {/* Badge */}
                  {product.badge && <span className="absolute top-4 left-4 bg-primaryBG text-[#B8975A] text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-full">{product.badge}</span>}
               </div>

               {/* Thumbnails — all images in one strip */}
               {allThumbnails.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                     {allThumbnails.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setActiveImage(img)}
                           className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0
                              ${displayImage === img ? "border-[#B8975A]" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                           <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
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
                     <p className="font-serif text-[26px] font-semibold text-headingColor leading-none">Rs {selectedMaterials.price?.toLocaleString()}</p>
                  </div>
                  {selectedMaterials && (
                     <div className="text-right">
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-1">After Discount</p>
                        <div className="flex items-center gap-2 justify-end">
                           <p className="font-serif text-[22px] font-semibold text-green-700 leading-none">Rs {selectedMaterials?.discountPrice?.toLocaleString()}</p>
                           {selectedMaterials?.discountPrice && <span className="text-[11px] bg-primaryBG text-[#B8975A] px-2 py-0.5 rounded">-{selectedMaterials?.discountPrice}%</span>}
                        </div>
                     </div>
                  )}
               </div>

               {/* Details card */}
               <div className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/15 px-4">
                  <InfoRow label="Stock">
                     <StockBadge stock={product.VariantSchema?.[0]?.stock} />
                  </InfoRow>
                  <InfoRow label="Materials">
                     <select
                        value={selectedMaterials.material}
                        className={selectCls(errors.singleMaterial)}
                        onChange={(e) => {
                           const selected = product.VariantSchema.find((m) => m.material === e.target.value);

                           if (selected) {
                              setSelectedMaterials(selected);
                           }
                        }}
                     >
                        <option value="">Select material...</option>
                        {product.VariantSchema.map((m) => (
                           <option key={m.material} value={m.material}>
                              {m.material}
                           </option>
                        ))}
                     </select>
                  </InfoRow>
                  <InfoRow label="Badge">{product.badge ? <span className="text-[11px] bg-primaryBG text-[#B8975A] px-2.5 py-1 rounded-full">{product.badge}</span> : <p className="text-[12px] text-[#5E5F60]">None</p>}</InfoRow>
                  <InfoRow label="ID">
                     <p className="text-[11px] text-[#5E5F60] font-mono">{product.id}</p>
                  </InfoRow>
               </div>

               {/* Description */}
               {(product as any).description && (
                  <div className="bg-staticSecondaryBG rounded-xl border border-[#B8975A]/15 p-4">
                     <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-2">Description</p>
                     <p className="text-[13px] text-headingColor leading-relaxed">{(product as any).description}</p>
                  </div>
               )}

               {/* Color variants */}
               {(selectedMaterials?.colors?.length ?? 0) > 0 && (
                  <div>
                     <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Color Variants ({selectedMaterials?.colors?.length})</p>
                     <div className="flex flex-col gap-2">
                        {selectedMaterials?.colors?.map((color, i) => {
                           const imgs: string[] = (color as any).images ?? ((color as any).image ? [(color as any).image] : []);
                           return (
                              <button
                                 key={color.hex}
                                 onClick={() => {
                                    setActiveColor(i);
                                    setActiveImage(imgs[0] ?? "");
                                 }}
                                 className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                                    ${activeColor === i ? "border-[#B8975A] bg-[#B8975A]/5" : "border-[#B8975A]/15 bg-staticSecondaryBG hover:border-[#B8975A]/30"}`}
                              >
                                 {/* Color swatch */}
                                 <div className="w-8 h-8 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                                 <div className="flex-1 text-left">
                                    <p className="text-[12px] font-mono text-[#5E5F60]">{color.hex}</p>
                                    <p className="text-[10px] text-[#5E5F60]/70 mt-0.5">
                                       {imgs.length} image{imgs.length !== 1 ? "s" : ""}
                                    </p>
                                 </div>
                                 {/* Color images preview strip */}
                                 <div className="flex gap-1 ml-auto">
                                    {imgs.slice(0, 3).map((img, j) => (
                                       <div key={j} className="w-9 h-9 rounded-lg overflow-hidden border border-[#B8975A]/15 shrink-0">
                                          <Image src={img} alt="" width={36} height={36} className="w-full h-full object-cover" />
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

         {/* ── Edit Modal (pre-filled) ── */}
         <UpdateProductModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            initialData={product}
            onSuccess={(updated) => {
               console.log("Updated product", updated);
               setEditOpen(false);
            }}
         />
      </div>
   );
}
