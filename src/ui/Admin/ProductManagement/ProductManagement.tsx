"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Products from "@/DummyData/Products.json";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import Table from "@/components/Table/Table";
import { Product } from "@/Types/Collection/CollectionTypes";
import AddProductModal from "@/components/Modal/AddProductModal";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Totes", "Shoulder Bags", "Crossbody", "Hobo", "Clutch", "Small Leather"];
const PAGE_SIZE = 10;

type StockFilter = "all" | "in" | "low" | "out";

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock?: number }) {
   const s = stock ?? 0;
   if (s === 0) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">Out of Stock</span>;
   if (s <= 5) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Low — {s}</span>;
   return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">In Stock — {s}</span>;
}

// ── Table columns ─────────────────────────────────────────────────────────────
const columns = [
   {
      key: "images",
      header: "Image",
      render: (images: string[]) => (
         <div className="w-10 h-10 rounded-lg overflow-hidden bg-staticSecondaryBG border border-[#B8975A]/15 shrink-0">
            {images?.[0] ? (
               <Image src={images[0]} alt="product" width={40} height={40} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <rect x="1" y="1" width="12" height="12" rx="2" stroke="#B8975A" strokeWidth="1.2" strokeOpacity="0.4" />
                  </svg>
               </div>
            )}
         </div>
      ),
   },
   {
      key: "name",
      header: "Product Name",
      render: (name: string) => <p className="text-[13px] font-medium text-headingColor">{name || "—"}</p>,
   },
   {
      key: "price",
      header: "Price",
      render: (price: number, item: Product) => <p className="text-[13px] font-serif font-medium text-headingColor">Rs {item?.VariantSchema?.[0]?.price?.toLocaleString() || "—"}</p>,
   },

   {
      key: "colors",
      header: "Colors",
      render: (colors: { hex: string; image: string }[], item: Product) => (
         <div className="flex items-center gap-1">
            {item?.VariantSchema?.flatMap((variant) =>
               variant.colors
                  ?.filter((c) => c.hex)
                  .slice(0, 5)
                  .map((c) => <div key={c.hex} className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />),
            )}

            {(item?.VariantSchema?.[0]?.colors?.length ?? 0) > 5 && <span className="text-[10px] text-[#5E5F60]">+{(item?.VariantSchema?.[0]?.colors?.length || 0) - 5}</span>}
         </div>
      ),
   },
   {
      key: "material",
      header: "Material",
      render: (material: string[], item: Product) => <p className="text-[12px] text-[#5E5F60]">{item?.VariantSchema?.flatMap((item, i) => <p className="text-[13px] font-serif text-headingColor">{item?.material},</p>) || "—"}</p>,
   },
   {
      key: "badge",
      header: "Badge",
      render: (badge: string) => (badge ? <span className="text-[10px] bg-primaryBG text-[#B8975A] px-2.5 py-1 rounded-full">{badge}</span> : <span className="text-[11px] text-[#5E5F60]">—</span>),
   },
   {
      key: "stock",
      header: "Stock",
      render: (stock: number, item: Product) => <StockBadge stock={item.VariantSchema?.[0]?.stock} />,
   },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductManagement() {
   const [search, setSearch] = useState("");
   const [stockFilter, setStockFilter] = useState<StockFilter>("all");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [selected, setSelected] = useState<string[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [addOpen, setAddOpen] = useState(false);

   const router = useRouter();

   const productss: Product[] = Products.products;

   // ── Filter logic ──────────────────────────────────────────────────────────
   const filtered = useMemo(() => {
      return productss.filter((p: Product) => {
         const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
         const matchCat = categoryFilter === "all" || p.VariantSchema?.[0]?.material?.includes(categoryFilter);
         const matchStock =
            stockFilter === "all" || (stockFilter === "out" && (p.VariantSchema?.[0]?.stock ?? 0) === 0) || (stockFilter === "low" && (p.VariantSchema?.[0]?.stock ?? 0) > 0 && (p.VariantSchema?.[0]?.stock ?? 0) <= 5) || (stockFilter === "in" && (p.VariantSchema?.[0]?.stock ?? 0) > 5);
         return matchSearch && matchCat && matchStock;
      });
   }, [search, stockFilter, categoryFilter]);

   // ── Table stock filter handler ────────────────────────────────────────────
   const handleTableStatusFilter = (_key: string, value: string | number) => {
      const map: Record<string, StockFilter> = {
         "In Stock": "in",
         "Low Stock": "low",
         "Out of Stock": "out",
         "": "all",
      };
      setStockFilter(map[value as string] ?? "all");
      setCurrentPage(1);
   };

   const handleDeleteSelected = () => {
      console.log("Delete selected", selected);
      setSelected([]);
   };

   return (
      <div className="flex flex-col gap-6">
         {/* ── Filters ── */}
         <ProductFilters
            search={search}
            onSearchChange={(v) => {
               setSearch(v);
               setCurrentPage(1);
            }}
            stockFilter={stockFilter}
            onStockChange={(v) => {
               setStockFilter(v);
               setCurrentPage(1);
            }}
            categoryFilter={categoryFilter}
            onCategoryChange={(v) => {
               setCategoryFilter(v);
               setCurrentPage(1);
            }}
            categories={CATEGORIES}
            totalResults={filtered.length}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            onAddProduct={() => setAddOpen(true)}
         />

         {/* ── Table ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
            <Table
               data={filtered}
               columns={columns}
               keyField="id"
               selectKey="id"
               tableName="All products"
               isSelect
               actions
               eye
               edit
               trash
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
               pageLimit={PAGE_SIZE}
               dataLength={filtered.length}
               setStatusFilter={handleTableStatusFilter}
               onEditClick={(item) => console.log("Edit", item)}
               onViewClick={(item) => router.push(`/admin/products/${item.id}`)}
               deleteFunctions={() => console.log("Delete")}
            />
         </div>

         {/* ── Add Product Modal ── */}
         <AddProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={(product) => console.log(product)} />
      </div>
   );
}
