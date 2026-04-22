"use client";

type StockFilter = "all" | "in" | "low" | "out";

type ProductFiltersProps = {
   search: string;
   onSearchChange: (v: string) => void;
   stockFilter: StockFilter;
   onStockChange: (v: StockFilter) => void;
   categoryFilter: string;
   onCategoryChange: (v: string) => void;
   categories: string[];
   totalResults: number;
   selectedCount: number;
   onDeleteSelected: () => void;
   onAddProduct: () => void;
};

const stockOptions: { value: StockFilter; label: string }[] = [
   { value: "all", label: "All Stock" },
   { value: "in", label: "In Stock" },
   { value: "low", label: "Low Stock" },
   { value: "out", label: "Out of Stock" },
];

export default function ProductFilters({ search, onSearchChange, stockFilter, onStockChange, categoryFilter, onCategoryChange, categories, totalResults, selectedCount, onDeleteSelected, onAddProduct }: ProductFiltersProps) {
   return (
      <div className="flex flex-col gap-4">
         {/* ── Top row: search + add ── */}
         <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-50">
               <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5F60]" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
               </svg>
               <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60] focus:outline-none focus:border-[#B8975A]/50 transition-colors"
               />
            </div>

            {/* Add Product btn */}
            <button onClick={onAddProduct} className="flex items-center gap-2 px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[13px] font-medium tracking-[0.04em] rounded-lg hover:bg-headingColor transition-colors whitespace-nowrap">
               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
               </svg>
               Add Product
            </button>
         </div>

         {/* ── Bottom row: filters + bulk actions ── */}
         <div className="flex items-center gap-3 flex-wrap">
            {/* Category */}
            <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)} className="px-3 py-2 text-[12px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/50 transition-colors cursor-pointer">
               <option value="all">All Categories</option>
               {categories.map((c) => (
                  <option key={c} value={c}>
                     {c}
                  </option>
               ))}
            </select>

            {/* Stock filter tabs */}
            <div className="flex items-center bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg overflow-hidden">
               {stockOptions.map((o) => (
                  <button
                     key={o.value}
                     onClick={() => onStockChange(o.value)}
                     className={`px-3 py-2 text-[12px] transition-colors whitespace-nowrap
                        ${stockFilter === o.value ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {o.label}
                  </button>
               ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Results count */}
            <p className="text-[12px] text-[#5E5F60]">
               {totalResults} product{totalResults !== 1 ? "s" : ""}
            </p>

            {/* Bulk delete — only when something selected */}
            {selectedCount > 0 && (
               <button onClick={onDeleteSelected} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-[12px] font-medium rounded-lg hover:bg-red-100 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                     <path d="M2 4h9M5 4V2.5h3V4M4 4l.5 6.5h4L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete ({selectedCount})
               </button>
            )}
         </div>
      </div>
   );
}
