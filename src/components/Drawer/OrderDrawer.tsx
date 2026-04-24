import { Order, OrderStatus } from "@/Types/Order/OrderType";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Row } from "../../ui/Admin/OrderManagement/OrderRows";
import { formatDate, formatTime } from "@/helper/FormateDateAndTime";
import { StatusBadge } from "@/ui/UI";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
   Pending: "Processing",
   Processing: "Shipped",
   Shipped: "Delivered",
   Delivered: null,
   Cancelled: null,
};

// ── Status Stepper ────────────────────────────────────────────────────────────
export function StatusStepper({ status }: { status: OrderStatus }) {
   const steps: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
   const cancelledOrDone = status === "Cancelled";
   const currentIdx = steps.indexOf(status);

   return (
      <div className="flex items-center gap-0">
         {steps.map((step, i) => {
            const done = !cancelledOrDone && currentIdx >= i;
            const active = !cancelledOrDone && currentIdx === i;
            return (
               <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                     <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border transition-all
                        ${done ? "bg-[#B8975A] border-[#B8975A] text-white" : "border-[#B8975A]/30 text-[#5E5F60]"}
                        ${active ? "ring-2 ring-[#B8975A]/30" : ""}`}
                     >
                        {done && !active ? (
                           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        ) : (
                           i + 1
                        )}
                     </div>
                     <p className={`text-[9px] tracking-wide whitespace-nowrap ${done ? "text-[#B8975A]" : "text-[#5E5F60]"}`}>{step}</p>
                  </div>
                  {i < steps.length - 1 && <div className={`h-px w-8 sm:w-12 mb-4 mx-1 transition-colors ${done && currentIdx > i ? "bg-[#B8975A]" : "bg-[#B8975A]/20"}`} />}
               </div>
            );
         })}
         {cancelledOrDone && <span className="ml-4 text-[11px] text-red-500 font-medium">Cancelled</span>}
      </div>
   );
}

// ── Order Detail Drawer ───────────────────────────────────────────────────────
export function OrderDrawer({ order, onClose, onStatusUpdate }: { order: Order | null; onClose: () => void; onStatusUpdate: (id: string, status: OrderStatus) => void }) {
   const drawerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [onClose]);

   const nextStatus = order ? STATUS_FLOW[order.status] : null;

   return (
      <>
         {/* Backdrop */}
         <div onClick={onClose} className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${order ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

         {/* Drawer */}
         <div
            ref={drawerRef}
            className={`fixed top-0 right-0 z-40 h-full w-full max-w-md bg-staticSecondaryBG shadow-2xl flex flex-col
               transition-transform duration-300 ease-in-out ${order ? "translate-x-0" : "translate-x-full"}`}
         >
            {!order ? null : (
               <>
                  {/* Drawer header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#B8975A]/15 shrink-0">
                     <div>
                        <h2 className="font-serif text-[20px] font-semibold text-headingColor tracking-[0.04em]">{order.orderNumber}</h2>
                        <p className="text-[11px] text-[#5E5F60] mt-0.5">
                           {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                        </p>
                     </div>
                     <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                           <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                     </button>
                  </div>

                  {/* Drawer body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
                     {/* Status stepper */}
                     <div className="bg-[#F5F0E8] rounded-xl p-4">
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Order Status</p>
                        <StatusStepper status={order.status} />
                     </div>

                     {/* Customer info */}
                     <div>
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Customer</p>
                        <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-2">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#B8975A] flex items-center justify-center text-white text-sm font-medium shrink-0">{order.customer.name.charAt(0)}</div>
                              <div>
                                 <p className="text-[13px] font-medium text-headingColor">{order.customer.name}</p>
                                 <p className="text-[11px] text-[#5E5F60]">{order.customer.email}</p>
                              </div>
                           </div>
                           <div className="border-t border-[#B8975A]/10 pt-2 mt-1 flex flex-col gap-1.5">
                              <Row label="Phone" value={order.customer.phone} />
                              <Row label="City" value={order.address.city} />
                              <Row label="Area" value={order.address.area} />
                              <Row label="Street" value={order.address.street} />
                           </div>
                        </div>
                     </div>

                     {/* Order items */}
                     <div>
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Items</p>
                        <div className="flex flex-col gap-2">
                           {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-[#F5F0E8] rounded-xl p-3">
                                 <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#B8975A]/15">
                                    <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-medium text-headingColor truncate">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                       <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.color }} />
                                       <p className="text-[11px] text-[#5E5F60]">
                                          {item.material} · Qty {item.quantity}
                                       </p>
                                    </div>
                                 </div>
                                 <p className="text-[13px] font-serif font-medium text-headingColor shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Order total */}
                     <div className="bg-[#F5F0E8] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                           <p className="text-[12px] text-[#5E5F60]">Subtotal</p>
                           <p className="text-[13px] font-serif text-headingColor">Rs {order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                           <p className="text-[12px] text-[#5E5F60]">Shipping</p>
                           <p className="text-[13px] text-green-600">Free</p>
                        </div>
                        <div className="border-t border-[#B8975A]/15 mt-3 pt-3 flex items-center justify-between">
                           <p className="text-[13px] font-medium text-headingColor">Total</p>
                           <p className="font-serif text-[18px] font-semibold text-headingColor">Rs {order.total.toLocaleString()}</p>
                        </div>
                     </div>
                  </div>

                  {/* Drawer footer — status action */}
                  <div className="px-6 py-4 border-t border-[#B8975A]/15 shrink-0 flex items-center justify-between gap-3">
                     <StatusBadge status={order.status} />
                     <div className="flex items-center gap-2">
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                           <button onClick={() => onStatusUpdate(order.id, "Cancelled")} className="px-4 py-2 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                              Cancel Order
                           </button>
                        )}
                        {nextStatus && (
                           <button onClick={() => onStatusUpdate(order.id, nextStatus)} className="flex items-center gap-1.5 px-4 py-2 bg-primaryBG text-[#B8975A] text-[12px] font-medium rounded-lg hover:bg-headingColor transition-colors">
                              Mark as {nextStatus}
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                 <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </button>
                        )}
                     </div>
                  </div>
               </>
            )}
         </div>
      </>
   );
}
