import { formatDate } from "@/helper/FormateDateAndTime";
import { getInitials } from "@/helper/GetInitials";
import { Customer } from "@/Types/Customer/CustomerType";
import { OrderStatus } from "@/Types/Order/OrderType";
import Image from "next/image";
import { useEffect } from "react";
import { MOCK_CUSTOMERS } from "@/DummyData/Customers";
import { InfoIconRow } from "@/ui/UI";

const STATUS_STYLE: Record<OrderStatus, string> = {
   Pending: "bg-amber-50 text-amber-700",
   Processing: "bg-blue-50 text-blue-700",
   Shipped: "bg-purple-50 text-purple-700",
   Delivered: "bg-green-50 text-green-700",
   Cancelled: "bg-red-50 text-red-600",
};
export const AVATAR_COLORS = ["bg-[#B8975A]", "bg-blue-400", "bg-purple-400", "bg-teal-400", "bg-rose-400", "bg-emerald-400"];

// ── Customer Drawer ───────────────────────────────────────────────────────────
export function CustomerDrawer({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [onClose]);

   return (
      <>
         {/* Backdrop */}
         <div onClick={onClose} className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${customer ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

         {/* Drawer */}
         <div
            className={`fixed top-0 right-0 z-40 h-full w-full max-w-md bg-staticSecondaryBG shadow-2xl flex flex-col
            transition-transform duration-300 ease-in-out ${customer ? "translate-x-0" : "translate-x-full"}`}
         >
            {!customer ? null : (
               <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#B8975A]/15 shrink-0">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 ${AVATAR_COLORS[MOCK_CUSTOMERS.findIndex((c) => c.id === customer.id) % AVATAR_COLORS.length]}`}>{getInitials(customer.name)}</div>
                        <div>
                           <h2 className="font-serif text-[18px] font-semibold text-headingColor tracking-[0.03em]">{customer.name}</h2>
                           <p className="text-[11px] text-[#5E5F60]">Joined {formatDate(customer.joinedAt)}</p>
                        </div>
                     </div>
                     <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E5F60] hover:text-headingColor hover:bg-[#B8975A]/10 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                           <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
                     {/* Stats */}
                     <div className="grid grid-cols-2 gap-3">
                        {[
                           { label: "Total Orders", value: customer.totalOrders },
                           { label: "Total Spent", value: `Rs ${customer.totalSpent.toLocaleString()}` },
                        ].map((s) => (
                           <div key={s.label} className="bg-[#F5F0E8] rounded-xl p-4">
                              <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-1">{s.label}</p>
                              <p className="font-serif text-[22px] font-semibold text-headingColor leading-none">{s.value}</p>
                           </div>
                        ))}
                     </div>

                     {/* Contact info */}
                     <div>
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Contact Info</p>
                        <div className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-2.5">
                           <InfoIconRow
                              icon={
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 3.5h10v8H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                    <path d="M2 3.5l5 4.5 5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                 </svg>
                              }
                              value={customer.email}
                           />
                           <InfoIconRow
                              icon={
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 2h2.5l1 3-1.5 1a7 7 0 003 3l1-1.5 3 1V11c0 1-4 3-8-4S2 3 3 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                 </svg>
                              }
                              value={customer.phone}
                           />
                           <InfoIconRow
                              icon={
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5c0-2.5-2-4.5-4.5-4.5Z" stroke="currentColor" strokeWidth="1.2" />
                                    <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                                 </svg>
                              }
                              value={customer.city}
                           />
                        </div>
                     </div>

                     {/* Order history */}
                     <div>
                        <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Order History ({customer.orders.length})</p>
                        <div className="flex flex-col gap-2">
                           {customer.orders.length > 0 ? (
                              customer.orders.map((order) => (
                                 <div key={order.id} className="bg-[#F5F0E8] rounded-xl p-4 flex flex-col gap-3">
                                    {/* Order top row */}
                                    <div className="flex items-center justify-between">
                                       <p className="text-[13px] font-medium text-[#B8975A]">{order.orderNumber}</p>
                                       <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                                    </div>

                                    {/* Items preview */}
                                    <div className="flex items-center gap-2">
                                       {order.items.slice(0, 3).map((item, i) => (
                                          <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-[#B8975A]/15 shrink-0">
                                             <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                                          </div>
                                       ))}
                                       {order.items.length > 3 && (
                                          <div className="w-10 h-10 rounded-lg bg-[#B8975A]/10 flex items-center justify-center shrink-0">
                                             <p className="text-[10px] text-[#B8975A] font-medium">+{order.items.length - 3}</p>
                                          </div>
                                       )}
                                       <div className="ml-auto text-right">
                                          <p className="font-serif text-[15px] font-semibold text-headingColor">Rs {order.total.toLocaleString()}</p>
                                          <p className="text-[11px] text-[#5E5F60]">{formatDate(order.createdAt)}</p>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="text-center py-8 text-[12px] text-[#5E5F60]">No orders yet</div>
                           )}
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </>
   );
}
