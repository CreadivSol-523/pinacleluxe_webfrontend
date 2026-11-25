"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus, PaymentStatus } from "@/Types/Order/OrderType";
import Table from "@/components/Table/Table";
import { formatDate } from "@/helper/FormateDateAndTime";
import { PaymentBadge, StatusBadge } from "@/ui/UI";
import { useGetOrdersHandler } from "@/modals/OrderModal";

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const ALL_PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Paid", "Failed"];
const PAGE_SIZE = 10;

// Table ke liye normalized row
type OrderRow = {
   id: string;
   orderNumber: string;
   customer: { name: string; email: string };
   items: NonNullable<Order["orderItems"]>;
   total: string;
   status: OrderStatus;
   paymentStatus: PaymentStatus;
   createdAt: string;
};

export default function OrderManagement() {
   const router = useRouter();
   const [currentPage, setCurrentPage] = useState(1); // Table aur API dono 1-based hain
   const [search, setSearch] = useState("");
   const [debouncedSearch, setDebouncedSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
   const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "All">("All");
   const [dateFilter, setDateFilter] = useState("");

   // Koi bhi filter active hai?
   const hasActiveFilters = search !== "" || dateFilter !== "" || statusFilter !== "All" || paymentFilter !== "All";

   const resetFilters = () => {
      setSearch("");
      setDebouncedSearch("");
      setDateFilter("");
      setStatusFilter("All");
      setPaymentFilter("All");
      setCurrentPage(1);
   };

   // Search debounce (har keystroke pe API call na ho)
   useEffect(() => {
      const t = setTimeout(() => {
         setDebouncedSearch((prev) => {
            const next = search.trim();
            // search sach mein change hua ho tabhi page 1 pe reset karo
            if (prev !== next) setCurrentPage(1);
            return next;
         });
      }, 400);
      return () => clearTimeout(t);
   }, [search]);

   // ── Main orders list ──
   const { data, isLoading, isError, refetch } = useGetOrdersHandler({
      page: currentPage,
      limit: PAGE_SIZE,
      status: statusFilter === "All" ? undefined : statusFilter,
      paymentStatus: paymentFilter === "All" ? undefined : paymentFilter,
      search: debouncedSearch || undefined,
   });

   // ── Stat cards: har status ka total API se (limit 1 = halka call) ──
   const allQ = useGetOrdersHandler({ page: 1, limit: 1 });
   const pendingQ = useGetOrdersHandler({ page: 1, limit: 1, status: "Pending" });
   const shippedQ = useGetOrdersHandler({ page: 1, limit: 1, status: "Shipped" });
   const deliveredQ = useGetOrdersHandler({ page: 1, limit: 1, status: "Delivered" });

   const stats = {
      total: allQ.data?.total ?? allQ.data?.pagination?.total ?? 0,
      pending: pendingQ.data?.total ?? pendingQ.data?.pagination?.total ?? 0,
      shipped: shippedQ.data?.total ?? shippedQ.data?.pagination?.total ?? 0,
      delivered: deliveredQ.data?.total ?? deliveredQ.data?.pagination?.total ?? 0,
   };

   const totalPages = data?.pages ?? data?.pagination?.pages ?? 1;

   // ── Backend order -> table row ──
   const rows: OrderRow[] = useMemo(() => {
      const list = data?.orders ?? data?.data ?? [];

      return (
         list
            .map((o) => {
               const id = (o._id ?? o.id) as string;
               return {
                  id,
                  orderNumber: `#${id.slice(-6).toUpperCase()}`,
                  customer: {
                     name: o.customerDetails?.fullName ?? "—",
                     email: o.customerDetails?.email ?? "—",
                  },
                  items: o.orderItems ?? [],
                  total: `Rs ${Number(o.totalPrice ?? 0).toLocaleString("en-PK")}`,
                  status: (o.orderStatus ?? "Pending") as OrderStatus,
                  paymentStatus: (o.paymentStatus ?? "Pending") as PaymentStatus,
                  createdAt: o.createdAt,
               };
            })
            // API date filter support nahi karti, isliye current page pe client-side
            .filter((o) => !dateFilter || o.createdAt.startsWith(dateFilter))
      );
   }, [data, dateFilter]);

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
         render: (item: unknown[]) => (
            <p className="text-[13px] text-headingColor">
               {item.length} item{item.length > 1 ? "s" : ""}
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
         key: "paymentStatus",
         header: "Payment Status",
         render: (item: PaymentStatus) => <PaymentBadge status={item} />,
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order, customer..."
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor placeholder:text-[#5E5F60] focus:outline-none focus:border-[#B8975A]/50 transition-colors"
               />
            </div>

            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3.5 py-2.5 text-[13px] bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg text-headingColor focus:outline-none focus:border-[#B8975A]/50 transition-colors cursor-pointer" />

            {/* Order status filter */}
            <div className="flex items-center bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg overflow-hidden">
               <span className="px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-[#5E5F60] border-r border-[#B8975A]/20">Status</span>
               {(["All", ...ALL_STATUSES] as const).map((s) => (
                  <button
                     key={s}
                     onClick={() => {
                        setStatusFilter(s);
                        setCurrentPage(1);
                     }}
                     className={`px-3 py-2.5 text-[12px] transition-colors whitespace-nowrap
                        ${statusFilter === s ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {s}
                  </button>
               ))}
            </div>

            {/* Payment status filter */}
            <div className="flex items-center bg-staticSecondaryBG border border-[#B8975A]/20 rounded-lg overflow-hidden">
               <span className="px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-[#5E5F60] border-r border-[#B8975A]/20">Payment</span>
               {(["All", ...ALL_PAYMENT_STATUSES] as const).map((s) => (
                  <button
                     key={s}
                     onClick={() => {
                        setPaymentFilter(s);
                        setCurrentPage(1);
                     }}
                     className={`px-3 py-2.5 text-[12px] transition-colors whitespace-nowrap
                        ${paymentFilter === s ? "bg-primaryBG text-[#B8975A]" : "text-[#5E5F60] hover:text-headingColor"}`}
                  >
                     {s}
                  </button>
               ))}
            </div>

            {/* Reset: sirf tab dikhega jab koi filter active ho */}
            {hasActiveFilters && (
               <button onClick={resetFilters} className="flex items-center gap-2 px-3.5 py-2.5 text-[12px] rounded-lg border border-[#B8975A]/30 text-[#B8975A] hover:bg-primaryBG transition-colors whitespace-nowrap">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                     <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.6 0 3 .7 4 1.8M13 2v3h-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Reset
               </button>
            )}
         </div>

         {/* ── Table ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
            {isError ? (
               <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <p className="text-[13px] text-[#5E5F60]">Orders load nahi ho sakay.</p>
                  <button onClick={() => refetch()} className="px-4 py-2 text-[12px] rounded-lg border border-[#B8975A]/30 text-[#B8975A] hover:bg-primaryBG transition-colors">
                     Retry
                  </button>
               </div>
            ) : isLoading && rows.length === 0 ? (
               <div className="flex items-center justify-center py-16">
                  <p className="text-[13px] text-[#5E5F60]">Loading orders...</p>
               </div>
            ) : rows.length === 0 ? (
               <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <p className="text-[13px] text-[#5E5F60]">Koi order nahi mila.</p>
                  {hasActiveFilters && (
                     <button onClick={resetFilters} className="px-4 py-2 text-[12px] rounded-lg border border-[#B8975A]/30 text-[#B8975A] hover:bg-primaryBG transition-colors">
                        Filters reset karo
                     </button>
                  )}
               </div>
            ) : (
               <Table currentPage={currentPage} setCurrentPage={setCurrentPage} tableName="Recent Orders" columns={columns} data={rows} actions={false} keyField="id" onRowClick={(item) => router.push(`/admin/orders/${(item as OrderRow).id}`)} numberOfPages={totalPages} />
            )}
         </div>
      </div>
   );
}
