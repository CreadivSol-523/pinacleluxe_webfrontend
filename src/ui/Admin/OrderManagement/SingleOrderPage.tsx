"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/Types/Order/OrderType";
import { formatDate, formatTime } from "@/helper/FormateDateAndTime";
import { StatusBadge } from "@/helper/StatusBadge";
import { MOCK_ORDERS } from "@/DummyData/OrdersData";
import { StatusStepper } from "./StatusStepper";

// ── Status flow ───────────────────────────────────────────────────────────────
const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
   Pending: "Processing",
   Processing: "Shipped",
   Shipped: "Delivered",
   Delivered: null,
   Cancelled: null,
};

// ── Info row helper ───────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-center justify-between py-2.5 border-b border-[#B8975A]/8 last:border-0">
         <p className="text-[11px] text-[#5E5F60]">{label}</p>
         <p className="text-[12px] font-medium text-headingColor">{value}</p>
      </div>
   );
}

export default function SingleOrderPage() {
   const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

   const router = useRouter();
   const params = useParams();
   const id = params.id;
   const order = useMemo(() => orders.find((o) => o.id === id), [orders, id]);

   const handleStatusUpdate = (status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)));
   };

   // ── Not found ─────────────────────────────────────────────────────────────
   if (!order) {
      return (
         <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg className="text-[#B8975A]/30 mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
               <rect x="4" y="6" width="40" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" />
               <path d="M12 18h24M12 26h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] font-medium text-headingColor">Order not found</p>
            <p className="text-[12px] text-[#5E5F60] mt-1">ID: {id}</p>
            <button onClick={() => router.back()} className="mt-4 px-4 py-2 text-[12px] text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors">
               ← Go Back
            </button>
         </div>
      );
   }

   const nextStatus = STATUS_FLOW[order.status];

   return (
      <div className="flex flex-col gap-6">
         {/* ── Top bar ── */}
         <div className="flex items-center justify-between flex-wrap gap-3">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[#5E5F60] hover:text-headingColor transition-colors">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L6 8l4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               Back to Orders
            </button>

            <div className="flex items-center gap-3">
               <StatusBadge status={order.status} />
               {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <button onClick={() => handleStatusUpdate("Cancelled")} className="px-4 py-2 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                     Cancel Order
                  </button>
               )}
               {nextStatus && (
                  <button onClick={() => handleStatusUpdate(nextStatus)} className="flex items-center gap-1.5 px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium rounded-lg hover:bg-headingColor transition-colors">
                     Mark as {nextStatus}
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </button>
               )}
            </div>
         </div>

         {/* ── Header card ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
               <h1 className="font-serif text-[26px]! font-semibold text-headingColor tracking-[0.03em]">{order.orderNumber}</h1>
               <p className="text-[12px]! text-[#5E5F60] mt-0.5">
                  Placed on {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
               </p>
            </div>
            <div className="text-right">
               <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Order Total</p>
               <p className="font-serif text-[24px] font-semibold text-headingColor">{order.total}</p>
            </div>
         </div>

         {/* ── Status stepper ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-4">Order Progress</p>
            <StatusStepper status={order.status} />
         </div>

         {/* ── Main grid ── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── Items (2 cols) ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#B8975A]/10">
                     <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium">Items ({order.items.length})</p>
                  </div>
                  <div className="divide-y divide-[#B8975A]/8 max-h-[50vh] overflow-y-auto">
                     {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4">
                           <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#B8975A]/15 shrink-0">
                              <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-headingColor truncate">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.color }} />
                                 <p className="text-[11px] text-[#5E5F60]">{item.material}</p>
                                 <span className="text-[#5E5F60]/40">·</span>
                                 <p className="text-[11px] text-[#5E5F60]">Qty {item.quantity}</p>
                              </div>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-[13px] font-serif font-medium text-headingColor">Rs {(item.price * item.quantity).toLocaleString()}</p>
                              {item.quantity > 1 && <p className="text-[10px] text-[#5E5F60]">Rs {item.price.toLocaleString()} each</p>}
                           </div>
                        </div>
                     ))}
                  </div>
                  {/* Total row */}
                  <div className="px-5 py-4 bg-[#F5F0E8]/50 border-t border-[#B8975A]/10 flex items-center justify-between">
                     <div>
                        <p className="text-[11px] text-[#5E5F60]">Subtotal</p>
                        <p className="text-[11px] text-[#5E5F60] mt-0.5">Shipping</p>
                        <p className="text-[13px] font-medium text-headingColor mt-1.5">Total</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[12px] text-headingColor">{order.total}</p>
                        <p className="text-[11px] text-green-600 mt-0.5">Free</p>
                        <p className="font-serif text-[18px] font-semibold text-headingColor mt-1">{order.total}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="flex flex-col gap-4">
               {/* Customer */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Customer</p>
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-9 h-9 rounded-full bg-[#B8975A] flex items-center justify-center text-white text-sm font-medium shrink-0">{order.customer.name.charAt(0)}</div>
                     <div>
                        <p className="text-[13px] font-medium text-headingColor">{order.customer.name}</p>
                        <p className="text-[11px] text-[#5E5F60]">{order.customer.email}</p>
                     </div>
                  </div>
                  <div className="border-t border-[#B8975A]/10 pt-3">
                     <InfoRow label="Phone" value={order.customer.phone} />
                  </div>
               </div>

               {/* Shipping address */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Shipping Address</p>
                  <InfoRow label="City" value={order.address.city} />
                  <InfoRow label="Area" value={order.address.area} />
                  <InfoRow label="Street" value={order.address.street} />
               </div>

               {/* Order meta */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Order Info</p>
                  <InfoRow label="Order ID" value={order.id} />
                  <InfoRow label="Placed" value={formatDate(order.createdAt)} />
                  <InfoRow label="Updated" value={formatDate(order.updatedAt)} />
               </div>
            </div>
         </div>
      </div>
   );
}
