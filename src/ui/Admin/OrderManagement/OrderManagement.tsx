"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Order, OrderStatus } from "@/Types/Order/OrderType";
import { OrderDrawer } from "../../../components/Drawer/OrderDrawer";
import Table from "@/components/Table/Table";
import { formatDate } from "@/helper/FormateDateAndTime";
import { StatusBadge } from "@/helper/StatusBadge";

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
      total: "Rs 11000",
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
      total: "Rs 14000",
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
      total: "Rs 22000",
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
      total: "Rs 6500",
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
      total: "Rs 19500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
   {
      id: "o3",
      orderNumber: "#4819",
      customer: { name: "Hira Baig", email: "hira@outlook.com", phone: "+92 333 5551234" },
      address: { city: "Islamabad", area: "F-7/2", street: "Street 12, House 3" },
      items: [{ productId: "p4", name: "Structured Hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", color: "#92400E", material: "Leather", quantity: 1, price: 14000 }],
      total: "Rs 14000",
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
      total: "Rs 22000",
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
      total: "Rs 6500",
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
      total: "Rs 19500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
   {
      id: "o3",
      orderNumber: "#4819",
      customer: { name: "Hira Baig", email: "hira@outlook.com", phone: "+92 333 5551234" },
      address: { city: "Islamabad", area: "F-7/2", street: "Street 12, House 3" },
      items: [{ productId: "p4", name: "Structured Hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", color: "#92400E", material: "Leather", quantity: 1, price: 14000 }],
      total: "Rs 14000",
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
      total: "Rs 22000",
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
      total: "Rs 6500",
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
      total: "Rs 19500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
   {
      id: "o3",
      orderNumber: "#4819",
      customer: { name: "Hira Baig", email: "hira@outlook.com", phone: "+92 333 5551234" },
      address: { city: "Islamabad", area: "F-7/2", street: "Street 12, House 3" },
      items: [{ productId: "p4", name: "Structured Hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", color: "#92400E", material: "Leather", quantity: 1, price: 14000 }],
      total: "Rs 14000",
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
      total: "Rs 22000",
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
      total: "Rs 6500",
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
      total: "Rs 19500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
   {
      id: "o3",
      orderNumber: "#4819",
      customer: { name: "Hira Baig", email: "hira@outlook.com", phone: "+92 333 5551234" },
      address: { city: "Islamabad", area: "F-7/2", street: "Street 12, House 3" },
      items: [{ productId: "p4", name: "Structured Hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", color: "#92400E", material: "Leather", quantity: 1, price: 14000 }],
      total: "Rs 14000",
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
      total: "Rs 22000",
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
      total: "Rs 6500",
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
      total: "Rs 19500",
      status: "Shipped",
      createdAt: "2026-03-22T08:00:00Z",
      updatedAt: "2026-03-22T09:00:00Z",
   },
];

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderManagement() {
   const [currentPage, setCurrentPage] = useState(0);
   const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
   const [dateFilter, setDateFilter] = useState("");
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
   const [page, setPage] = useState(1);
   const PAGE_SIZE = 8;

   // ── Filter ────────────────────────────────────────────────────────────────
   const filtered = useMemo(() => {
      return orders.filter((o) => {
         const q = search.toLowerCase();
         const matchSearch = !search || o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q);
         const matchStatus = statusFilter === "All" || o.status === statusFilter;
         const matchDate = !dateFilter || o.createdAt.startsWith(dateFilter);
         return matchSearch && matchStatus && matchDate;
      });
   }, [orders, search, statusFilter, dateFilter]);

   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

   // ── Status update ─────────────────────────────────────────────────────────
   const handleStatusUpdate = (id: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)));
      setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
   };

   // Stats
   const stats = useMemo(
      () => ({
         total: orders.length,
         pending: orders.filter((o) => o.status === "Pending").length,
         shipped: orders.filter((o) => o.status === "Shipped").length,
         delivered: orders.filter((o) => o.status === "Delivered").length,
      }),
      [orders],
   );

   const columns = [
      {
         key: "orderNumber",
         header: "Order",
         mapKey: "id",
         render: (item: string) => <span className="text-[#B8975A]">{item}</span>,
      },

      {
         key: "customer",
         header: "Items",
         mapKey: "customer",
         render: (item: { name: string; email: string; phone: string }) => (
            <div className="min-w-0">
               <p className="text-[13px] font-medium text-headingColor truncate">{item.name}</p>
               <p className="text-[11px] text-[#5E5F60] truncate">{item.email}</p>
            </div>
         ),
      },
      {
         key: "items",
         header: "Items",
         mapKey: "Items",
         render: (item: []) => (
            <div className="min-w-0">
               <p className="text-[13px] font-medium text-headingColor truncate">{item.length} Items</p>
            </div>
         ),
      },
      {
         key: "total",
         header: "Total",
         mapKey: "Total",
      },
      {
         key: "status",
         header: "Status",
         mapKey: "Status",
         render: (item: OrderStatus) => <StatusBadge status={item} />,
      },
      {
         key: "createdAt",
         header: "Date",
         mapKey: "Date",
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
            {/* Search */}
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

            {/* Date filter */}
            <input
               type="date"
               value={dateFilter}
               onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
               }}
               className="px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/50 transition-colors cursor-pointer"
            />

            {/* Status tabs */}
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
            <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Recent Orders" BtnName={"Add Appointment"} columns={columns} data={MOCK_ORDERS || []} actions={false} keyField="_id" onRowClick={(item) => setSelectedOrder(item as Order)} numberOfPages={5} />
         </div>

         {/* ── Order Detail Drawer ── */}
         <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} />
      </div>
   );
}
