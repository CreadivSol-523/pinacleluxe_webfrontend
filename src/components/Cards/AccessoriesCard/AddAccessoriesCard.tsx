"use client";

interface RegionInfo {
   _id: string;
   code: string;
   name: string;
   currency: string;
}

interface PriceEntry {
   region: RegionInfo;
   price: number;
   discountMode?: "percentage" | "static";
   discountValue?: number;
}

interface AccessoryProduct {
   _id: string;
   name: string;
   isVariable: boolean;
   categories?: { _id: string; name: string; slug: string }[];
   thumbnail?: string[];
   images?: string[];
   pricing?: PriceEntry[];
   variants?: { material: string; price: PriceEntry[] }[];
}

interface AccessoryCardProps {
   product: AccessoryProduct;
   selected: boolean;
   onToggle: () => void;
}

// Discount ke baad final price
const getFinalPrice = (p: PriceEntry) => {
   const hasDiscount = !!p.discountValue && p.discountValue > 0;
   if (!hasDiscount) return { final: p.price, hasDiscount: false };
   const final = p.discountMode === "percentage" ? Math.round(p.price - (p.price * p.discountValue!) / 100) : Math.round(p.price - p.discountValue!);
   return { final, hasDiscount: true };
};

export default function AddAccessoryCard({ product, selected, onToggle }: AccessoryCardProps) {
   const thumb = product.thumbnail?.[0] ?? product.images?.[0];

   // Variable ho to har variant (material) ki apni prices, warna product ki pricing
   const groups = product.isVariable ? (product.variants ?? []).map((v) => ({ label: v.material, prices: v.price ?? [] })) : [{ label: undefined as string | undefined, prices: product.pricing ?? [] }];

   const hasAnyPrice = groups.some((g) => g.prices.length > 0);

   return (
      <button
         type="button"
         onClick={onToggle}
         className={`relative text-left rounded-xl overflow-hidden border transition-all bg-[#F5F0E8]
            ${selected ? "border-[#B8975A] ring-2 ring-[#B8975A]/30" : "border-[#B8975A]/15 hover:border-[#B8975A]/50"}`}
      >
         {/* Thumbnail */}
         <div className="aspect-square bg-[#EDE8DF]">
            {thumb ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-[10px] text-[#5E5F60]">No image</div>
            )}
         </div>

         {/* Check badge */}
         {selected && (
            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#B8975A] flex items-center justify-center">
               <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                  <path d="M2 7l3.5 3.5L11 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </span>
         )}

         {/* Info */}
         <div className="p-2.5 flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-headingColor line-clamp-1">{product.name}</p>
            {product.categories && product.categories.length > 0 && <p className="text-[9px] uppercase tracking-wider text-[#5E5F60] line-clamp-1">{product.categories.map((c) => c.name).join(", ")}</p>}

            {hasAnyPrice ? (
               groups.map((g, gi) => (
                  <div key={g.label ?? gi} className="flex flex-col gap-0.5">
                     {g.label && <p className="text-[10px] text-[#5E5F60] line-clamp-1">{g.label}</p>}
                     {g.prices.map((p) => {
                        const { final, hasDiscount } = getFinalPrice(p);
                        return (
                           <p key={p.region?._id ?? p.region?.code} className="text-[11px] text-[#B8975A] font-medium flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] text-[#5E5F60] font-normal uppercase tracking-wider">{p.region?.code}</span>
                              <span>
                                 {p.region?.currency} {final.toLocaleString()}
                              </span>
                              {hasDiscount && <span className="text-[10px] text-[#5E5F60] line-through font-normal">{p.price.toLocaleString()}</span>}
                           </p>
                        );
                     })}
                  </div>
               ))
            ) : (
               <p className="text-[10px] text-[#5E5F60]">No price</p>
            )}
         </div>
      </button>
   );
}
