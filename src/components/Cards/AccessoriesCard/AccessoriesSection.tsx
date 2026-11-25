"use client";

import { useState } from "react";
import { useGetProductHandler } from "@/modals/ProductModal";
import AddAccessoryCard from "./AddAccessoriesCard";

const ACCESSORIES_PAGE_LIMIT = 12;

const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[11px] tracking-[0.08em] uppercase text-[#5E5F60] mb-1.5">{children}</p>;

const selectCls = `w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 focus:border-[#B8975A]/60 rounded-lg text-headingColor focus:outline-none transition-colors cursor-pointer`;

interface AccessoriesSectionProps {
   selected: string[];
   onToggle: (id: string) => void;
   categories?: any[]; // CATEGORY_TREE (parent + children)
   regionCode?: string;
   excludeId?: string; // Update modal mein product khud ko accessory na bana sake
}

export default function AccessoriesSection({ selected, onToggle, categories = [], regionCode = "", excludeId }: AccessoriesSectionProps) {
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);
   const [category, setCategory] = useState("");

   // Category + sub-categories ko ek flat list bana lo (sub-category indent ke saath)
   const categoryOptions = categories.flatMap((c: any) => [{ _id: c._id, name: c.name }, ...(c.children ?? []).map((s: any) => ({ _id: s._id, name: `— ${s.name}` }))]);

   // Selected ids form state mein hain, is liye page badalne par bhi selection safe rehti hai
   const { data, isLoading } = useGetProductHandler({
      limit: ACCESSORIES_PAGE_LIMIT,
      page,
      badge: "",
      material: "",
      color: "",
      category,
      regionCode,
   });
   const products = data?.products || [];

   // API response type: { success, pagination: { total, page, pages, limit }, products }
   const totalPages: number = data?.pagination?.pages ?? 1;
   const hasNext = page < totalPages;
   const hasPrev = page > 1;

   // API mein search param nahi hai, is liye sirf current page ke andar filter hota hai
   const filtered = products.filter((p: any) => p._id !== excludeId && p.name.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <Label>Select Accessories</Label>
            <span className="text-[11px] text-[#B8975A]">{selected.length} selected</span>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search products..."
               className="w-full px-3.5 py-2.5 text-[13px] bg-[#F5F0E8] border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60]/60 focus:outline-none focus:border-[#B8975A]/60 transition-colors"
            />
            <select
               value={category}
               onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1); // filter badalne par pehle page se shuru
               }}
               className={selectCls}
            >
               <option value="">All categories</option>
               {categoryOptions.map((c) => (
                  <option key={c._id} value={c._id}>
                     {c.name}
                  </option>
               ))}
            </select>
         </div>

         {isLoading ? (
            <p className="text-[12px] text-[#5E5F60] text-center py-8">Loading...</p>
         ) : filtered.length === 0 ? (
            <p className="text-[12px] text-[#5E5F60] text-center py-8 border border-dashed border-[#B8975A]/20 rounded-xl">No products found</p>
         ) : (
            <div className="grid grid-cols-3 gap-3">
               {filtered.map((p: any) => (
                  <AddAccessoryCard key={p._id} product={p} selected={selected.includes(p._id)} onToggle={() => onToggle(p._id)} />
               ))}
            </div>
         )}

         {/* Pagination */}
         {(hasPrev || hasNext) && (
            <div className="flex items-center justify-between pt-1">
               <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev || isLoading}
                  className="px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
               >
                  Prev
               </button>
               <span className="text-[11px] text-[#5E5F60]">{`Page ${page} of ${totalPages}`}</span>
               <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || isLoading}
                  className="px-4 py-2 text-[12px] text-[#5E5F60] border border-[#B8975A]/20 rounded-lg hover:text-headingColor hover:border-[#B8975A]/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
               >
                  Next
               </button>
            </div>
         )}
      </div>
   );
}
