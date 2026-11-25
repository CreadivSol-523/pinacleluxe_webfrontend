"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { OrderStatus } from "@/Types/Order/OrderType";
import { formatDate, formatTime } from "@/helper/FormateDateAndTime";
import { StatusStepper } from "./StatusStepper";
import { PaymentBadge, StatusBadge } from "@/ui/UI";
import { useGetOrderByIdHandler, useUpdateOrderStatusHandler } from "@/modals/OrderModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";

// ── Status flow ───────────────────────────────────────────────────────────────
const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
   Pending: "Processing",
   Processing: "Shipped",
   Shipped: "Delivered",
   Delivered: null,
   Cancelled: null,
};

const formatPrice = (n?: number) => `Rs ${Number(n ?? 0).toLocaleString("en-PK")}`;

// ── Info row helper ───────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
   return (
      <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[#B8975A]/8 last:border-0">
         <p className="text-[11px] text-[#5E5F60] shrink-0">{label}</p>
         <p className="text-[12px] font-medium text-headingColor text-right break-all">{value || "—"}</p>
      </div>
   );
}

export default function SingleOrderPage() {
   const router = useRouter();
   const params = useParams();
   const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

   const [showCancelModal, setShowCancelModal] = useState(false);

   const { data, isLoading, isError, refetch } = useGetOrderByIdHandler(id);
   const order = useMemo(() => data?.order ?? data?.data, [data]);

   // Hooks hamesha early returns se pehle
   const { handleUpdateOrderStatus, isLoading: isUpdating } = useUpdateOrderStatusHandler();

   const handleStatusUpdate = async (orderStatus: OrderStatus) => {
      if (isUpdating) return;

      // orderId backend ki _id hai, paymentStatus wohi jo single order se aa raha hai
      return handleUpdateOrderStatus({
         id: (order?._id ?? order?.id ?? id) as string,
         orderStatus,
         paymentStatus: order?.paymentStatus as string | undefined,
      });
   };

   const handleConfirmCancel = async () => {
      const res = await handleStatusUpdate("Cancelled");
      // Success par modal band, fail par khula rahe taake retry kar sako
      if (res?.success) setShowCancelModal(false);
   };

   // ── Loading ───────────────────────────────────────────────────────────────
   if (isLoading && !order) {
      return (
         <div className="flex items-center justify-center py-32">
            <p className="text-[13px] text-[#5E5F60]">Loading order...</p>
         </div>
      );
   }

   // ── Error / Not found ─────────────────────────────────────────────────────
   if (isError || !order) {
      return (
         <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg className="text-[#B8975A]/30 mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
               <rect x="4" y="6" width="40" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" />
               <path d="M12 18h24M12 26h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] font-medium text-headingColor">{isError ? "Failed to load order" : "Order not found"}</p>
            <p className="text-[12px] text-[#5E5F60] mt-1">ID: {id}</p>
            <div className="flex items-center gap-3 mt-4">
               <button onClick={() => router.back()} className="px-4 py-2 text-[12px] text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors">
                  ← Go Back
               </button>
               {isError && (
                  <button onClick={() => refetch()} className="px-4 py-2 text-[12px] text-[#B8975A] border border-[#B8975A]/30 rounded-lg hover:bg-[#B8975A]/5 transition-colors">
                     Retry
                  </button>
               )}
            </div>
         </div>
      );
   }

   // ── Backend data -> UI values ─────────────────────────────────────────────
   const orderId = (order._id ?? order.id) as string;
   const orderNumber = `#${orderId.slice(-6).toUpperCase()}`;
   const status = (order.orderStatus ?? "Pending") as OrderStatus;
   const paymentStatus = (order.paymentStatus ?? "Pending") as string;
   const customer = order.customerDetails;
   const items = order.orderItems ?? [];
   const shipping = Number(order.shippingPrice ?? 0);
   const tax = Number(order.taxPrice ?? 0);
   const nextStatus = STATUS_FLOW[status];

   return (
      <div className="flex flex-col gap-6">
         {/* ── Cancel confirmation modal ── */}
         <ConfirmModal
            open={showCancelModal}
            variant="danger"
            title="Cancel this order?"
            description="Are you sure you want to cancel this order? The items will be returned to stock and this action cannot be undone."
            confirmText="Yes, Cancel Order"
            cancelText="Keep Order"
            loading={isUpdating}
            onConfirm={handleConfirmCancel}
            onClose={() => setShowCancelModal(false)}
         >
            <div className="flex items-center justify-between bg-[#F5F0E8]/60 border border-[#B8975A]/15 rounded-lg px-4 py-3">
               <div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Order</p>
                  <p className="font-serif text-[15px] font-semibold text-headingColor">{orderNumber}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Total</p>
                  <p className="font-serif text-[15px] font-semibold text-headingColor">{formatPrice(order.totalPrice)}</p>
               </div>
            </div>
         </ConfirmModal>

         {/* ── Top bar ── */}
         <div className="flex items-center justify-between flex-wrap gap-3">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[#5E5F60] hover:text-headingColor transition-colors">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L6 8l4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               Back to Orders
            </button>

            <div className="flex items-center gap-3 flex-wrap">
               <StatusBadge status={status} />
               <PaymentBadge status={paymentStatus} />
               {status !== "Cancelled" && status !== "Delivered" && (
                  <button onClick={() => setShowCancelModal(true)} disabled={isUpdating} className="px-4 py-2 text-[12px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                     Cancel Order
                  </button>
               )}
               {nextStatus && (
                  <button onClick={() => handleStatusUpdate(nextStatus)} disabled={isUpdating} className="flex items-center gap-1.5 px-4 py-2.5 bg-primaryBG text-[#B8975A] text-[12px] font-medium rounded-lg hover:bg-headingColor transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                     {isUpdating ? "Updating..." : `Mark as ${nextStatus}`}
                     {!isUpdating && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                           <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     )}
                  </button>
               )}
            </div>
         </div>

         {/* ── Header card ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
               <h1 className="font-serif text-[26px]! font-semibold text-headingColor tracking-[0.03em]">{orderNumber}</h1>
               <p className="text-[12px]! text-[#5E5F60] mt-0.5">
                  Placed on {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
               </p>
            </div>
            <div className="text-right">
               <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60]">Order Total</p>
               <p className="font-serif text-[24px] font-semibold text-headingColor">{formatPrice(order.totalPrice)}</p>
               <div className="flex justify-end mt-1.5">
                  <PaymentBadge status={paymentStatus} />
               </div>
            </div>
         </div>

         {/* ── Status stepper ── */}
         <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-4">Order Progress</p>
            <StatusStepper status={status} />
         </div>

         {/* ── Main grid ── */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── Items (2 cols) ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#B8975A]/10">
                     <p className="text-[11px] tracking-[0.12em] uppercase text-headingColor font-medium">Items ({items.length})</p>
                  </div>
                  <div className="divide-y divide-[#B8975A]/8 max-h-[50vh] overflow-y-auto">
                     {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4">
                           <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#B8975A]/15 shrink-0">
                              <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-headingColor truncate">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 {item.color && <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.color }} />}
                                 {item.material && (
                                    <>
                                       <p className="text-[11px] text-[#5E5F60]">{item.material}</p>
                                       <span className="text-[#5E5F60]/40">·</span>
                                    </>
                                 )}
                                 <p className="text-[11px] text-[#5E5F60]">Qty {item.quantity}</p>
                              </div>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-[13px] font-serif font-medium text-headingColor">{formatPrice(item.price * item.quantity)}</p>
                              {item.quantity > 1 && <p className="text-[10px] text-[#5E5F60]">{formatPrice(item.price)} each</p>}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Total rows */}
                  <div className="px-5 py-4 bg-[#F5F0E8]/50 border-t border-[#B8975A]/10 flex flex-col gap-1.5">
                     <div className="flex items-center justify-between">
                        <p className="text-[11px] text-[#5E5F60]">Subtotal</p>
                        <p className="text-[12px] text-headingColor">{formatPrice(order.itemsPrice)}</p>
                     </div>
                     <div className="flex items-center justify-between">
                        <p className="text-[11px] text-[#5E5F60]">Shipping</p>
                        {shipping > 0 ? <p className="text-[12px] text-headingColor">{formatPrice(shipping)}</p> : <p className="text-[11px] text-green-600">Free</p>}
                     </div>
                     {tax > 0 && (
                        <div className="flex items-center justify-between">
                           <p className="text-[11px] text-[#5E5F60]">Tax</p>
                           <p className="text-[12px] text-headingColor">{formatPrice(tax)}</p>
                        </div>
                     )}
                     <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#B8975A]/10">
                        <p className="text-[13px] font-medium text-headingColor">Total</p>
                        <p className="font-serif text-[18px] font-semibold text-headingColor">{formatPrice(order.totalPrice)}</p>
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
                     <div className="w-9 h-9 rounded-full bg-[#B8975A] flex items-center justify-center text-white text-sm font-medium shrink-0">{customer?.fullName?.trim().charAt(0).toUpperCase() || "?"}</div>
                     <div className="min-w-0">
                        <p className="text-[13px] font-medium text-headingColor truncate">{customer?.fullName}</p>
                        <p className="text-[11px] text-[#5E5F60] truncate">{customer?.email}</p>
                     </div>
                  </div>
                  <div className="border-t border-[#B8975A]/10 pt-3">
                     <InfoRow label="Phone" value={customer?.phone} />
                  </div>
               </div>

               {/* Payment */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Payment</p>
                  <div className="flex items-center justify-between py-2.5 border-b border-[#B8975A]/8">
                     <p className="text-[11px] text-[#5E5F60]">Status</p>
                     <PaymentBadge status={paymentStatus} />
                  </div>
                  <InfoRow label="Method" value={order.paymentMethod} />
                  <InfoRow label="Gateway" value={order.paymentGateway} />
                  <InfoRow label="Transaction ID" value={order.gatewayTransactionId} />
               </div>

               {/* Shipping address */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Shipping Address</p>
                  <InfoRow label="Address" value={customer?.address} />
                  <InfoRow label="City" value={customer?.city} />
                  <InfoRow label="Postal Code" value={customer?.postalCode} />
                  <InfoRow label="Country" value={customer?.country} />
               </div>

               {/* Order meta */}
               <div className="bg-staticSecondaryBG border border-[#B8975A]/15 rounded-xl p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#5E5F60] mb-3">Order Info</p>
                  <InfoRow label="Order ID" value={orderId} />
                  <InfoRow label="Placed" value={formatDate(order.createdAt)} />
                  <InfoRow label="Updated" value={formatDate(order.updatedAt)} />
               </div>
            </div>
         </div>
      </div>
   );
}
