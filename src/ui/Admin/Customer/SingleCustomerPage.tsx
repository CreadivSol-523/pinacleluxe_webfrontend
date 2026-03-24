"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Customer } from "@/Types/Customer/CustomerType";
import { OrderStatus } from "@/Types/Order/OrderType";
import { formatDate } from "@/helper/FormateDateAndTime";
import { AVATAR_COLORS } from "@/components/Drawer/CustomerDrawer";
import { getInitials } from "@/helper/GetInitials";
import { StatusBadge } from "@/helper/StatusBadge";
import { MOCK_CUSTOMERS } from "@/DummyData/Customers";

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-center justify-between py-2.5 border-b border-[#B8975A]/8 last:border-0">
         <p className="text-[11px] text-[#5E5F60]">{label}</p>
         <p className="text-[12px] font-medium text-headingColor">{value}</p>
      </div>
   );
}

export default function SingleCustomerPage() {
   const router = useRouter();
   const params = useParams();
   const id = params.id;

   const customer: Customer | undefined = useMemo(() => MOCK_CUSTOMERS.find((c) => c.id === id), [id]);

   const customerIdx = useMemo(() => MOCK_CUSTOMERS.findIndex((c) => c.id === id), [id]);

   // ── Not found ─────────────────────────────────────────────────────────────
   if (!customer) {
      return (
         <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg className="text-[#B8975A]/30 mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
               <circle cx="24" cy="18" r="9" stroke="currentColor" strokeWidth="1.5" />
               <path d="M8 44c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] font-medium text-headingColor">Customer not found</p>
            <p className="text-[12px] text-[#5E5F60] mt-1">ID: {id}</p>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 text-[12px] text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors">
               ← Go Back
            </button>
         </div>
      );
   }

   const avatarColor = AVATAR_COLORS[customerIdx % AVATAR_COLORS.length];

   return (
      <div className="flex flex-col gap-6">
         {/* ── Top bar ── */}
         <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[#5E5F60] hover:text-headingColor transition-colors">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L6 8l4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               Back to Customers
            </button>
         </div>

         {/* ── Header card ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-6 flex items-center gap-5 flex-wrap">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium shrink-0 ${avatarColor}`}>{getInitials(customer.name)}</div>
            <div className="flex-1 min-w-0">
               <h1 className="font-serif text-[24px] font-semibold text-headingColor tracking-[0.02em]">{customer.name}</h1>
               <p className="text-[12px] text-[#5E5F60] mt-0.5">Customer since {formatDate(customer.joinedAt)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 shrink-0">
               <div className="text-center bg-[#F5F0E8] rounded-xl px-5 py-3">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Orders</p>
                  <p className="font-serif text-[22px] font-semibold text-headingColor mt-0.5">{customer.totalOrders}</p>
               </div>
               <div className="text-center bg-[#F5F0E8] rounded-xl px-5 py-3">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Total Spent</p>
                  <p className="font-serif text-[18px] font-semibold text-headingColor mt-0.5">Rs {customer.totalSpent.toLocaleString()}</p>
               </div>
            </div>
         </div>

         {/* ── Main grid ── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── Order history (2 cols) ── */}
            <div className="lg:col-span-2">
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#B8975A]/10">
                     <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium">Order History ({customer.orders.length})</p>
                  </div>

                  {customer.orders.length > 0 ? (
                     <div className="divide-y divide-[#B8975A]/8">
                        {customer.orders.map((order) => (
                           <div key={order.id} onClick={() => router.push(`/admin/orders/${order.id}`)} className="px-5 py-4 hover:bg-[#B8975A]/3 transition-colors cursor-pointer">
                              {/* Order top row */}
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <p className="text-[13px] font-medium text-[#B8975A]">{order.orderNumber}</p>
                                    <StatusBadge status={order.status as OrderStatus} />
                                 </div>
                                 <div className="text-right">
                                    <p className="font-serif text-[15px] font-semibold text-headingColor">{order.total}</p>
                                    <p className="text-[11px] text-[#5E5F60]">{formatDate(order.createdAt)}</p>
                                 </div>
                              </div>

                              {/* Item previews */}
                              <div className="flex items-center gap-2">
                                 {order.items.slice(0, 4).map((item, i) => (
                                    <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-[#B8975A]/15 shrink-0">
                                       <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                                    </div>
                                 ))}
                                 {order.items.length > 4 && (
                                    <div className="w-10 h-10 rounded-lg bg-[#B8975A]/10 flex items-center justify-center shrink-0">
                                       <p className="text-[10px] text-[#B8975A] font-medium">+{order.items.length - 4}</p>
                                    </div>
                                 )}
                                 <p className="ml-2 text-[11px] text-[#5E5F60]">
                                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                 </p>
                                 <svg className="ml-auto text-[#5E5F60]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-[13px] font-medium text-headingColor">No orders yet</p>
                        <p className="text-[12px] text-[#5E5F60] mt-1">This customer has not placed any orders</p>
                     </div>
                  )}
               </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="flex flex-col gap-4">
               {/* Contact info */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Contact Info</p>
                  <InfoRow label="Email" value={customer.email} />
                  <InfoRow label="Phone" value={customer.phone} />
                  <InfoRow label="City" value={customer.city} />
               </div>

               {/* Account info */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Account</p>
                  <InfoRow label="Customer ID" value={customer.id} />
                  <InfoRow label="Joined" value={formatDate(customer.joinedAt)} />
                  <InfoRow label="Total Orders" value={String(customer.totalOrders)} />
                  <InfoRow label="Total Spent" value={`Rs ${customer.totalSpent.toLocaleString()}`} />
               </div>
            </div>
         </div>
      </div>
   );
}
