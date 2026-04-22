"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/Types/Order/OrderType";
import Table from "@/components/Table/Table";
import { formatDate } from "@/helper/FormateDateAndTime";
import { StatusBadge } from "@/ui/UI";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
   {
      id: "o1",
      orderNumber: "#4821",
      customer: { name: "Aisha Khan", email: "aisha@gmail.com", phone: "+92 300 1234567" },
      address: { city: "Karachi", area: "DHA Phase 6", street: "Street 4, House 12" },
      items: [
         { productId: "p1", name: "Easy Zipper Tote", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", color: "#2563EB", material: "Leather", quantity: 1, price: 11000 },
         { productId: "p2", name: "Mini Crossbody", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", color: "#1C1917", material: "Suede", quantity: 1, price: 8500 },
      ],
      total: "Rs 19,500",
      status: "Shipped",
      createdAt: "2026-03-20T10:30:00Z",
      updatedAt: "2026-03-21T08:00:00Z",
   },
   {
      id: "o2",
      orderNumber: "#4820",
      customer: { name: "Sara Malik", email: "sara@gmail.com", phone: "+92 321 9876543" },
      address: { city: "Lahore", area: "Gulberg III", street: "Main Blvd, Apt 5B" },
      items: [{ productId: "p3", name: "Jo Malone Sakura", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200", color: "#F9A8D4", material: "Canvas", quantity: 1, price: 11000 }],
      total: "Rs 11,000",
      status: "Pending",
      createdAt: "2026-03-21T14:00:00Z",
      updatedAt: "2026-03-21T14:00:00Z",
   },
   {
      id: "o3",
      orderNumber: "#4819",
      customer: { name: "Hira Baig", email: "hira@outlook.com", phone: "+92 333 5551234" },
      address: { city: "Islamabad", area: "F-7/2", street: "Street 12, House 3" },
      items: [{ productId: "p4", name: "Structured Hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", color: "#92400E", material: "Leather", quantity: 1, price: 14000 }],
      total: "Rs 14,000",
      status: "Processing",
      createdAt: "2026-03-19T09:15:00Z",
      updatedAt: "2026-03-20T11:00:00Z",
   },
   {
      id: "o4",
      orderNumber: "#4818",
      customer: { name: "Nadia Siddiqui", email: "nadia@gmail.com", phone: "+92 311 7774444" },
      address: { city: "Karachi", area: "Clifton Block 5", street: "Sea View Apts, 8A" },
      items: [{ productId: "p1", name: "Easy Zipper Tote", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", color: "#16A34A", material: "Leather", quantity: 2, price: 11000 }],
      total: "Rs 22,000",
      status: "Delivered",
      createdAt: "2026-03-15T16:45:00Z",
      updatedAt: "2026-03-18T10:30:00Z",
   },
   {
      id: "o5",
      orderNumber: "#4817",
      customer: { name: "Zara Ahmed", email: "zara@hotmail.com", phone: "+92 345 2223333" },
      address: { city: "Lahore", area: "Model Town", street: "Block C, House 44" },
      items: [{ productId: "p5", name: "Evening Clutch", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200", color: "#6D28D9", material: "Satin", quantity: 1, price: 6500 }],
      total: "Rs 6,500",
      status: "Cancelled",
      createdAt: "2026-03-14T12:00:00Z",
      updatedAt: "2026-03-14T15:00:00Z",
   },
   {
      id: "o6",
      orderNumber: "#4816",
      customer: { name: "Fatima Rizvi", email: "fatima@gmail.com", phone: "+92 300 8889999" },
      address: { city: "Rawalpindi", area: "Bahria Town", street: "Phase 4, Street 7" },
      items: [
         { productId: "p2", name: "Mini Crossbody", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", color: "#1C1917", material: "Suede", quantity: 1, price: 8500 },
         { productId: "p3", name: "Jo Malone Sakura", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200", color: "#78716C", material: "Canvas", quantity: 1, price: 11000 },
      ],
      total: "Rs 19,500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
];

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderManagement() {
   const router = useRouter();
   const [currentPage, setCurrentPage] = useState(0);
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
   const [dateFilter, setDateFilter] = useState("");
   const [page, setPage] = useState(1);
   const PAGE_SIZE = 8;

   const filtered = useMemo(() => {
      return MOCK_ORDERS.filter((o) => {
         const q = search.toLowerCase();
         const matchSearch = !search || o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q);
         const matchStatus = statusFilter === "All" || o.status === statusFilter;
         const matchDate = !dateFilter || o.createdAt.startsWith(dateFilter);
         return matchSearch && matchStatus && matchDate;
      });
   }, [search, statusFilter, dateFilter]);

   const stats = useMemo(
      () => ({
         total: MOCK_ORDERS.length,
         pending: MOCK_ORDERS.filter((o) => o.status === "Pending").length,
         shipped: MOCK_ORDERS.filter((o) => o.status === "Shipped").length,
         delivered: MOCK_ORDERS.filter((o) => o.status === "Delivered").length,
      }),
      [],
   );

   const columns = [
      {
         key: "orderNumber",
         header: "Order",
         render: (item: string) => <span className="text-[#B8975A] font-medium">{item}</span>,
      },
      {
         key: "customer",
         header: "Customer",
         render: (item: { name: string; email: string }) => (
            <div className="min-w-0">
               <p className="text-[13px] font-medium text-headingColor truncate">{item.name}</p>
               <p className="text-[11px] text-[#5E5F60] truncate">{item.email}</p>
            </div>
         ),
      },
      {
         key: "items",
         header: "Items",
         render: (item: []) => (
            <p className="text-[13px] text-headingColor">
               {item.length} item{item?.length > 1 ? "s" : ""}
            </p>
         ),
      },
      {
         key: "total",
         header: "Total",
         render: (item: string) => <p className="text-[13px] font-serif font-medium text-headingColor">{item}</p>,
      },
      {
         key: "status",
         header: "Status",
         render: (item: OrderStatus) => <StatusBadge status={item} />,
      },
      {
         key: "createdAt",
         header: "Date",
         render: (item: string) => <p className="text-[11px] text-[#5E5F60] whitespace-nowrap">{formatDate(item)}</p>,
      },
   ];

   return (
      <div className="flex flex-col gap-6">
         {/* ── Stat cards ── */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
               { label: "Total Orders", value: stats.total },
               { label: "Pending", value: stats.pending },
               { label: "Shipped", value: stats.shipped },
               { label: "Delivered", value: stats.delivered },
            ].map((s) => (
               <div key={s.label} className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.14em] uppercase text-[#5E5F60] mb-2">{s.label}</p>
                  <p className="font-serif text-[28px] font-semibold text-headingColor leading-none">{s.value}</p>
               </div>
            ))}
         </div>

         {/* ── Filters ── */}
         <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-50">
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
                  placeholder="Search order, customer..."
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60] focus:outline-none focus:border-[#B8975A]/50 transition-colors"
               />
            </div>
            <input
               type="date"
               value={dateFilter}
               onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
               }}
               className="px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/50 transition-colors cursor-pointer"
            />
            <div className="flex items-center bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg overflow-hidden">
               {(["All", ...ALL_STATUSES] as const).map((s) => (
                  <button
                     key={s}
                     onClick={() => {
                        setStatusFilter(s);
                        setPage(1);
                     }}
                     className={`px-3 py-2.5 text-[12px] transition-colors whitespace-nowrap
                        ${statusFilter === s ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {s}
                  </button>
               ))}
            </div>
         </div>

         {/* ── Table ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
            <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Recent Orders" columns={columns} data={filtered} actions={false} keyField="id" onRowClick={(item) => router.push(`/admin/orders/${(item as Order).id}`)} numberOfPages={Math.ceil(filtered.length / PAGE_SIZE)} />
         </div>
      </div>
   );
}
