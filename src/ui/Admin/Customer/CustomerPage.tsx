"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Customer } from "@/Types/Customer/CustomerType";
import { formatDate } from "@/helper/FormateDateAndTime";
import { AVATAR_COLORS, CustomerDrawer } from "@/components/Drawer/CustomerDrawer";
import { getInitials } from "@/helper/GetInitials";
import { MOCK_CUSTOMERS } from "@/DummyData/Customers";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CustomerPage() {
   const [search, setSearch] = useState("");
   const [cityFilter, setCityFilter] = useState("all");
   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
   const [page, setPage] = useState(1);
   const PAGE_SIZE = 8;

   const filtered = useMemo(() => {
      return MOCK_CUSTOMERS.filter((c) => {
         const q = search.toLowerCase();
         const matchSearch = !search || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
         const matchCity = cityFilter === "all" || c.city === cityFilter;
         return matchSearch && matchCity;
      });
   }, [search, cityFilter]);

   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

   const stats = useMemo(
      () => ({
         total: MOCK_CUSTOMERS.length,
         totalRevenue: MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0),
         avgSpend: Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / MOCK_CUSTOMERS.length),
      }),
      [],
   );

   return (
      <div className="flex flex-col gap-6">
         {/* ── Stat cards ── */}
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
               { label: "Total Customers", value: stats.total },
               { label: "Total Revenue", value: `Rs ${stats.totalRevenue.toLocaleString()}` },
               { label: "Avg. Spend", value: `Rs ${stats.avgSpend.toLocaleString()}` },
            ].map((s) => (
               <div key={s.label} className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.14em] uppercase text-[#5E5F60] mb-2">{s.label}</p>
                  <p className="font-serif text-[24px] font-semibold text-headingColor leading-none">{s.value}</p>
               </div>
            ))}
         </div>

         {/* ── Filters ── */}
         <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
               <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5F60]" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
               </svg>
               <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                     setSearch(e.target.value);
                     setPage(1);
                  }}
                  placeholder="Search name, email, phone..."
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60] focus:outline-none focus:border-[#B8975A]/50 transition-colors"
               />
            </div>

            {/* City filter */}
            <select
               value={cityFilter}
               onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
               }}
               className="px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/50 transition-colors cursor-pointer"
            >
               <option value="all">All Cities</option>
               {CITIES.map((c) => (
                  <option key={c} value={c}>
                     {c}
                  </option>
               ))}
            </select>

            <p className="self-center text-[12px] text-[#5E5F60]">{filtered.length} customers</p>
         </div>

         {/* ── Table ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
            {/* Head */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#B8975A]/15 bg-[#F5F0E8]/60">
               {["Customer", "Contact", "City", "Orders", "Spent"].map((h) => (
                  <p key={h} className="text-[10px] tracking-[0.1em] uppercase text-[#5E5F60] font-medium">
                     {h}
                  </p>
               ))}
            </div>

            {paginated.length > 0 ? (
               paginated.map((customer, idx) => (
                  <div key={customer.id} onClick={() => setSelectedCustomer(customer)} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[#B8975A]/8 hover:bg-[#B8975A]/3 transition-colors cursor-pointer items-center">
                     {/* Customer */}
                     <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-medium shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>{getInitials(customer.name)}</div>
                        <div className="min-w-0">
                           <p className="text-[13px] font-medium text-headingColor truncate">{customer.name}</p>
                           <p className="text-[11px] text-[#5E5F60]">Since {formatDate(customer.joinedAt)}</p>
                        </div>
                     </div>

                     {/* Contact */}
                     <div className="min-w-0">
                        <p className="text-[12px] text-headingColor truncate">{customer.email}</p>
                        <p className="text-[11px] text-[#5E5F60]">{customer.phone}</p>
                     </div>

                     {/* City */}
                     <p className="text-[12px] text-[#5E5F60]">{customer.city}</p>

                     {/* Orders */}
                     <p className="text-[13px] font-medium text-headingColor">{customer.totalOrders}</p>

                     {/* Spent */}
                     <p className="text-[13px] font-serif font-medium text-headingColor">Rs {customer.totalSpent.toLocaleString()}</p>
                  </div>
               ))
            ) : (
               <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="text-[#B8975A]/30 mb-3" width="40" height="40" viewBox="0 0 40 40" fill="none">
                     <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
                     <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[13px] font-medium text-headingColor">No customers found</p>
                  <p className="text-[12px] text-[#5E5F60] mt-1">Try adjusting your search or filters</p>
               </div>
            )}
         </div>

         {/* ── Pagination ── */}
         {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
               <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
               {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                     key={i}
                     onClick={() => setPage(i + 1)}
                     className={`w-9 h-9 rounded-lg text-[13px] font-medium border transition-colors
                        ${page === i + 1 ? "bg-primaryBG text-[#B8975A] border-primaryBG" : "border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40"}`}
                  >
                     {i + 1}
                  </button>
               ))}
               <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#B8975A]/20 bg-staticSecondaryBG text-[#5E5F60] hover:border-[#B8975A]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </div>
         )}

         {/* ── Drawer ── */}
         <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      </div>
   );
}
