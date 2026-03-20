"use client";

import { Product, ProductColor } from "@/Types/Collection/CollectionTypes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type AdminProductCardProps = {
   data: Product;
   isSelected: boolean;
   onSelect: (id: string) => void;
   onDelete: (id: string) => void;
};

const AdminProductCards = ({ data, isSelected, onSelect, onDelete }: AdminProductCardProps) => {
   const [isHover, setIsHover] = useState(false);
   const [selectedColor, setSelectedColor] = useState<ProductColor>({ hex: "", image: "" });

   const displayImage = isHover ? data?.gallery?.[0] : selectedColor.image ? selectedColor.image : data?.images?.[0] || "/Dummy/Product/ProductImg.png";

   const stockStatus = (data.stock ?? 0) === 0 ? { label: "Out of Stock", cls: "bg-red-50 text-red-600" } : (data.stock ?? 0) <= 5 ? { label: "Low Stock", cls: "bg-amber-50 text-amber-600" } : { label: "In Stock", cls: "bg-green-50 text-green-700" };

   return (
      <div
         className={`relative group overflow-hidden  border transition-all duration-200
         ${isSelected ? "border-[#B8975A]" : "border-[#B8975A]/15 hover:border-[#B8975A]/40"}`}
      >
         {/* ── Checkbox ── */}
         <button
            onClick={() => onSelect(data.id || "")}
            className={`absolute top-3 left-3 z-10 w-5 h-5 rounded flex items-center justify-center border transition-all duration-150
               ${isSelected ? "bg-[#B8975A] border-[#B8975A]" : "bg-white/80 border-[#B8975A]/40 opacity-0 group-hover:opacity-100"}`}
         >
            {isSelected && (
               <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            )}
         </button>

         {/* ── Image ── */}
         <div className="relative overflow-hidden bg-staticSecondaryBG">
            <Image width={500} height={800} src={displayImage} alt={data.name || "Product"} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="object-cover object-center! w-full 2xl:h-150 xl:h-110 lg:h-80 sm:h-125 h-130 max-[600px]:w-full" />

            {/* Badge */}
            {data.badge && <span className="absolute top-3 right-3 bg-primaryBG text-white text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full">{data.badge}</span>}

            {/* Edit / Delete — show on hover */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 bg-linear-to-t from-black/40 to-transparent">
               <Link href={`/admin/products/${data.id}/edit`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-staticSecondaryBG text-headingColor text-[11px] font-medium rounded-lg hover:bg-white transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  Edit
               </Link>
               <button onClick={() => onDelete(data.id || "")} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-100 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 4h9M5 4V2.5h3V4M4 4l.5 6.5h4L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete
               </button>
            </div>
         </div>

         {/* ── Info ── */}
         <div className="p-4 bg-staticSecondaryBG flex flex-col gap-2.5">
            {/* Colors */}
            <div className="flex items-center gap-1.5">
               {data?.colors
                  ?.filter((c) => c.hex && c.image)
                  .map((c) =>
                     selectedColor.hex === c.hex ? (
                        <div key={c.hex} className="w-4 h-4 border-2 border-[#B8975A] rounded-full flex items-center justify-center">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
                        </div>
                     ) : (
                        <button key={c.hex} onClick={() => setSelectedColor({ hex: c.hex, image: c.image })} className="w-4 h-4 rounded-full border border-black/10 hover:scale-110 transition-transform" style={{ backgroundColor: c.hex }} />
                     ),
                  )}
            </div>

            {/* Name */}
            <h3 className="text-[13px] font-medium text-headingColor leading-tight line-clamp-1">{data.name || "Product Name"}</h3>

            {/* Price + Stock */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <p className="text-[13px] text-headingColor font-serif">Rs {data.price?.toLocaleString()}</p>
                  {data.discountPrice && <span className="text-[10px] bg-primaryBG text-white px-2 py-0.5 rounded">Rs {data.discountPrice.toLocaleString()}</span>}
               </div>
               <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stockStatus.cls}`}>{stockStatus.label}</span>
            </div>
         </div>
      </div>
   );
};

export default AdminProductCards;
