"use client";

import { useState, useMemo } from "react";
// import { Product } from "@/Types/Collection/CollectionTypes";
import Products from "@/DummyData/Products.json";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import AdminProductCards from "./AdminProductCards";
import { Product } from "@/Types/Collection/CollectionTypes";
import AddProductModal from "@/components/Modal/AddProductModal";

const CATEGORIES = ["Totes", "Shoulder Bags", "Crossbody", "Hobo", "Clutch", "Small Leather"];
const PAGE_SIZE = 6;

type StockFilter = "all" | "in" | "low" | "out";

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProductManagement() {
   const [search, setSearch] = useState("");
   const [stockFilter, setStockFilter] = useState<StockFilter>("all");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [selected, setSelected] = useState<string[]>([]);
   const [page, setPage] = useState(1);
   const [addOpen, setAddOpen] = useState(false);

   const productss: Product[] = Products.products;

   // ── Filter logic ──
   const filtered = useMemo(() => {
      return productss.filter((p: Product) => {
         const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
         const matchCat = categoryFilter === "all" || p.material?.includes(categoryFilter);
         const matchStock = stockFilter === "all" || (stockFilter === "out" && (p.stock ?? 0) === 0) || (stockFilter === "low" && (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5) || (stockFilter === "in" && (p.stock ?? 0) > 5);
         return matchSearch && matchCat && matchStock;
      });
   }, [search, stockFilter, categoryFilter]);

   // ── Pagination ──
   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

   // ── Select handlers ──
   const handleSelect = (id: string) => {
      setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
   };

   const handleSelectAll = () => {
      const pageIds = paginated.map((p) => p.id || "");
      const allSelected = pageIds.every((id) => selected.includes(id));
      if (allSelected) {
         setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
      } else {
         setSelected((prev) => [...new Set([...prev, ...pageIds])]);
      }
   };

   const handleDelete = (id: string) => {
      // wire to API later
      console.log("Delete", id);
   };

   const handleDeleteSelected = () => {
      // wire to API later
      console.log("Delete selected", selected);
      setSelected([]);
   };

   const pageIds = paginated.map((p) => p.id || "");
   const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

   return (
      <div className="flex flex-col gap-6">
         {/* ── Filters ── */}
         <ProductFilters
            search={search}
            onSearchChange={(v) => {
               setSearch(v);
               setPage(1);
            }}
            stockFilter={stockFilter}
            onStockChange={(v) => {
               setStockFilter(v);
               setPage(1);
            }}
            categoryFilter={categoryFilter}
            onCategoryChange={(v) => {
               setCategoryFilter(v);
               setPage(1);
            }}
            categories={CATEGORIES}
            totalResults={filtered.length}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            onAddProduct={() => setAddOpen(true)}
         />

         {/* ── Select all row ── */}
         <div className="flex items-center gap-3">
            <button
               onClick={handleSelectAll}
               className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                  ${allPageSelected ? "bg-[#B8975A] border-[#B8975A]" : "border-[#B8975A]/30 bg-staticSecondaryBG"}`}
            >
               {allPageSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                     <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               )}
            </button>
            <span className="text-[12px] text-[#5E5F60]">{allPageSelected ? "Deselect all on this page" : "Select all on this page"}</span>
            {selected.length > 0 && <span className="text-[12px] text-[#B8975A] font-medium">{selected.length} selected</span>}
         </div>

         {/* ── Grid ── */}
         {paginated.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3   gap-4">
               {paginated.map((product) => (
                  <AdminProductCards key={product.id} data={product} isSelected={selected.includes(product.id || "")} onSelect={handleSelect} onDelete={handleDelete} />
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <svg className="text-[#B8975A]/30 mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 14l4 24h24l4-24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M4 14h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M28 14a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" />
               </svg>
               <p className="text-[14px] font-medium text-headingColor">No products found</p>
               <p className="text-[12px] text-[#5E5F60] mt-1">Try adjusting your search or filters</p>
            </div>
         )}

         {/* ── Pagination ── */}
         {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
               {/* Prev */}
               <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40 hover:text-headingColor disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>

               {/* Page numbers */}
               {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = p === page;
                  // show first, last, current ±1, and ellipsis
                  const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const showEllipsisBefore = p === page - 2 && page > 3;
                  const showEllipsisAfter = p === page + 2 && page < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                     return (
                        <span key={p} className="text-[#5E5F60] text-[13px] px-1">
                           …
                        </span>
                     );
                  }
                  if (!show) return null;

                  return (
                     <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-colors border
                           ${isActive ? "bg-primaryBG text-[#B8975A] border-primaryBG" : "border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40 hover:text-headingColor"}`}
                     >
                        {p}
                     </button>
                  );
               })}

               {/* Next */}
               <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40 hover:text-headingColor disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </div>
         )}
         <AddProductModal
            isOpen={addOpen}
            onClose={() => setAddOpen(false)}
            onSuccess={(product) => console.log(product)} // API call yahan
         />
      </div>
   );
}
