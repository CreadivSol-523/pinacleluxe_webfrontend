"use client";
import MainLayout from "@/layout/MainLayout";
import { useGetOrderByIdHandler } from "@/modals/OrderModal";
import { Check, CheckCircle, Clock, Copy, Download, Loader2, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// TODO: apne store ka naam yahan likho (receipt PDF ke header mein aata hai)
const STORE_NAME = "Your Store";

interface OrderDetails {
   _id: string;
   orderNumber?: string;
   currency?: string;
   orderItems?: Array<{
      name: string;
      productName?: string;
      quantity: number;
      price: number;
      image?: string;
      thumbnail?: string;
   }>;
   items?: Array<{
      productName: string;
      name?: string;
      quantity: number;
      price: number;
      thumbnail?: string;
      image?: string;
   }>;
   customerDetails?: {
      fullName: string;
      address: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      phone: string;
      email: string;
   };
   shippingAddress?: {
      fullName: string;
      address: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      phone: string;
      email: string;
   };
   itemsPrice?: number;
   subtotal?: number;
   shippingPrice?: number;
   shippingCost?: number;
   taxPrice?: number;
   tax?: number;
   totalPrice?: number;
   total?: number;
   orderStatus?: string;
   status?: string;
   paymentStatus: string;
   notes?: string;
   createdAt: string;
}

const STEPS = [
   { key: "pending", label: "Placed", Icon: Clock },
   { key: "processing", label: "Processing", Icon: Package },
   { key: "shipped", label: "Shipped", Icon: Truck },
   { key: "delivered", label: "Delivered", Icon: CheckCircle },
] as const;

type DownloadState = "idle" | "working" | "done" | "error";

/* -------------------------------------------------------------------------- */
/*  Receipt PDF                                                                */
/* -------------------------------------------------------------------------- */

type ReceiptData = {
   storeName: string;
   ref: string;
   date: string;
   status: string;
   payment: string;
   currency: string;
   items: { name: string; quantity: number; price: number }[];
   subtotal: number;
   shipping: number;
   tax: number;
   total: number;
   customer: { name: string; lines: string[]; phone?: string; email?: string };
};

const buildReceiptPdf = async (d: ReceiptData) => {
   // dynamic import: bundle halka rahta hai aur SSR mein masla nahi hota
   const { jsPDF } = await import("jspdf");
   const doc = new jsPDF({ unit: "mm", format: "a4" });

   const pageW = doc.internal.pageSize.getWidth();
   const pageH = doc.internal.pageSize.getHeight();
   const M = 18;
   const right = pageW - M;
   let y = 22;

   const ink = () => doc.setTextColor(20, 20, 20);
   const muted = () => doc.setTextColor(120, 120, 120);
   const hair = (at: number, strong = false) => {
      doc.setDrawColor(strong ? 40 : 226, strong ? 40 : 226, strong ? 40 : 226);
      doc.setLineWidth(strong ? 0.4 : 0.2);
      doc.line(M, at, right, at);
   };
   const money = (n: number) => `${d.currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
   const ensureSpace = (h: number) => {
      if (y + h > pageH - 28) {
         doc.addPage();
         y = 22;
      }
   };

   // Header
   doc.setFont("helvetica", "bold");
   doc.setFontSize(18);
   ink();
   doc.text(d.storeName, M, y);
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   muted();
   doc.text("Receipt", right, y, { align: "right" });
   y += 5;
   hair(y, true);
   y += 11;

   // Meta
   const meta: [string, string, number, number][] = [
      ["Order", d.ref, M, y],
      ["Date", d.date, M, y + 15],
      ["Order status", d.status, M + 100, y],
      ["Payment", d.payment, M + 100, y + 15],
   ];
   meta.forEach(([label, value, x, yy]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      muted();
      doc.text(label, x, yy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      ink();
      doc.text(value, x, yy + 5.5);
   });
   y += 32;

   // Items table header
   const colQty = right - 62;
   const colPrice = right - 30;
   doc.setFont("helvetica", "normal");
   doc.setFontSize(8.5);
   muted();
   doc.text("Item", M, y);
   doc.text("Qty", colQty, y, { align: "right" });
   doc.text("Price", colPrice, y, { align: "right" });
   doc.text("Amount", right, y, { align: "right" });
   y += 3;
   hair(y);
   y += 7;

   // Items
   doc.setFontSize(10);
   d.items.forEach((item) => {
      const lines = doc.splitTextToSize(item.name, 90) as string[];
      const rowH = lines.length * 5 + 5;
      ensureSpace(rowH);
      doc.setFont("helvetica", "normal");
      ink();
      doc.text(lines, M, y);
      doc.text(String(item.quantity), colQty, y, { align: "right" });
      doc.text(money(item.price), colPrice, y, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(money(item.price * item.quantity), right, y, { align: "right" });
      y += rowH - 1;
      hair(y - 2.5);
      y += 2;
   });

   // Totals
   ensureSpace(46);
   y += 4;
   const labelX = right - 70;
   const totalRow = (label: string, value: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      muted();
      doc.text(label, labelX, y);
      ink();
      doc.text(value, right, y, { align: "right" });
      y += 6.5;
   };
   totalRow("Subtotal", money(d.subtotal));
   totalRow("Shipping", d.shipping > 0 ? money(d.shipping) : "Free");
   if (d.tax > 0) totalRow("Tax", money(d.tax));
   y += 1;
   doc.setDrawColor(20, 20, 20);
   doc.setLineWidth(0.4);
   doc.line(labelX, y, right, y);
   y += 7;
   doc.setFont("helvetica", "bold");
   doc.setFontSize(13);
   ink();
   doc.text("Total", labelX, y);
   doc.text(money(d.total), right, y, { align: "right" });
   y += 16;

   // Shipping address
   ensureSpace(42);
   doc.setFont("helvetica", "normal");
   doc.setFontSize(8.5);
   muted();
   doc.text("Shipped to", M, y);
   y += 6;
   doc.setFont("helvetica", "bold");
   doc.setFontSize(10.5);
   ink();
   doc.text(d.customer.name, M, y);
   y += 5.5;
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   d.customer.lines.forEach((line) => {
      doc.text(line, M, y);
      y += 5;
   });
   if (d.customer.phone) {
      y += 1;
      doc.text(`Phone: ${d.customer.phone}`, M, y);
      y += 5;
   }
   if (d.customer.email) {
      doc.text(`Email: ${d.customer.email}`, M, y);
   }

   // Footer (har page par)
   const pages = doc.getNumberOfPages();
   for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      muted();
      doc.text(`Thank you for shopping with ${d.storeName}.`, pageW / 2, pageH - 16, { align: "center" });
      doc.setFontSize(8);
      doc.text("This is a computer-generated receipt and does not need a signature.", pageW / 2, pageH - 11.5, { align: "center" });
   }

   doc.save(`receipt-${d.ref.replace(/[^a-z0-9-]/gi, "")}.pdf`);
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const OrderConfirmation = () => {
   const params = useParams();
   const orderId = (params?.id as string) || "";

   const [copied, setCopied] = useState(false);
   const [downloadState, setDownloadState] = useState<DownloadState>("idle");

   const { data: orderData, isLoading: loading, error: fetchError } = useGetOrderByIdHandler(orderId);

   const order = (orderData?.order || orderData?.data) as OrderDetails | undefined;
   const error = fetchError ? "Failed to load order details" : !loading && !order ? "Order not found" : null;

   if (loading) {
      return (
         <MainLayout>
            <div className="min-h-screen bg-neutral-50">
               <div className="mx-auto max-w-6xl animate-pulse px-5 py-12 sm:px-8">
                  <div className="mb-10 flex items-start gap-5">
                     <div className="h-12 w-12 rounded-full bg-neutral-200" />
                     <div className="flex-1 space-y-3">
                        <div className="h-9 w-64 rounded bg-neutral-200" />
                        <div className="h-4 w-96 max-w-full rounded bg-neutral-200" />
                     </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                     <div className="h-120 rounded-2xl bg-neutral-200/70" />
                     <div className="h-96 rounded-2xl bg-neutral-200/70" />
                  </div>
               </div>
            </div>
         </MainLayout>
      );
   }

   if (error || !order) {
      return (
         <MainLayout>
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-5">
               <div className="max-w-md text-center">
                  <h2 className="mb-3 text-2xl font-semibold text-headingColor">We couldn&apos;t find this order</h2>
                  <div className="mb-8 text-lightText">{error || "This order does not exist or has been removed."}</div>
                  <Link href="/" className="inline-block rounded-full bg-BtnBlack px-8 py-3 text-white transition-opacity hover:opacity-90">
                     Back to home
                  </Link>
               </div>
            </div>
         </MainLayout>
      );
   }

   /* ----------------------------- derived values ---------------------------- */

   const itemsList = order.orderItems || order.items || [];
   const shippingInfo = order.shippingAddress ||
      order.customerDetails || {
         fullName: "Valued Customer",
         address: "",
         city: "",
         state: "",
         postalCode: "",
         country: "",
         phone: "",
         email: "",
      };

   const statusVal = (order.orderStatus || order.status || "pending").toLowerCase();
   const isCancelled = statusVal === "cancelled" || statusVal === "canceled";
   const stepIndex = Math.max(
      0,
      STEPS.findIndex((s) => s.key === statusVal),
   );

   const subtotalVal = order.itemsPrice ?? order.subtotal ?? 0;
   const shippingVal = order.shippingPrice ?? order.shippingCost ?? 0;
   const taxVal = order.taxPrice ?? order.tax ?? 0;
   const totalVal = order.totalPrice ?? order.total ?? subtotalVal + shippingVal + taxVal;
   const totalUnits = itemsList.reduce((sum, i) => sum + (i.quantity || 0), 0);

   const currency = (order.currency || "Rs").replace(/^RS$/, "Rs");
   const money = (n: number) => `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

   const orderRef = order.orderNumber || order._id;
   const firstName = shippingInfo.fullName?.split(" ")[0] || "there";
   const paymentVal = order.paymentStatus || "pending";
   const isPaid = ["paid", "completed", "success"].includes(paymentVal.toLowerCase());

   const placedAt = order.createdAt ? new Date(order.createdAt) : null;
   const placedLabel = placedAt && !isNaN(placedAt.getTime()) ? placedAt.toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" }) : "";

   const addressLine2 = [shippingInfo.city, shippingInfo.state, shippingInfo.postalCode].filter(Boolean).join(", ");
   const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

   /* -------------------------------- handlers ------------------------------- */

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(orderRef);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch {
         /* clipboard block ho to chup chaap ignore */
      }
   };

   const handleDownload = async () => {
      if (downloadState === "working") return;
      setDownloadState("working");
      try {
         await buildReceiptPdf({
            storeName: STORE_NAME,
            ref: orderRef,
            date: placedLabel || "-",
            status: capitalize(statusVal),
            payment: capitalize(paymentVal),
            currency,
            items: itemsList.map((i) => ({
               name: (i as any).name || (i as any).productName || "Product",
               quantity: i.quantity,
               price: i.price,
            })),
            subtotal: subtotalVal,
            shipping: shippingVal,
            tax: taxVal,
            total: totalVal,
            customer: {
               name: shippingInfo.fullName,
               lines: [shippingInfo.address, addressLine2, shippingInfo.country].filter(Boolean),
               phone: shippingInfo.phone,
               email: shippingInfo.email,
            },
         });
         setDownloadState("done");
      } catch (err) {
         console.error("Receipt generation failed", err);
         setDownloadState("error");
      }
      setTimeout(() => setDownloadState("idle"), 2500);
   };

   const downloadLabel = { idle: "Download receipt", working: "Preparing receipt", done: "Receipt downloaded", error: "Couldn't create receipt. Try again" }[downloadState];

   /* --------------------------------- render -------------------------------- */

   return (
      <MainLayout isHeader={false}>
         {/* Ek hi page-load moment: check mark draw hota hai */}
         <style>{`
            @keyframes oc-draw { to { stroke-dashoffset: 0; } }
            .oc-ring { stroke-dasharray: 139; stroke-dashoffset: 139; animation: oc-draw .9s ease-out .1s forwards; }
            .oc-tick { stroke-dasharray: 40; stroke-dashoffset: 40; animation: oc-draw .5s ease-out .8s forwards; }
            @media (prefers-reduced-motion: reduce) {
               .oc-ring, .oc-tick { animation: none; stroke-dashoffset: 0; }
            }
         `}</style>

         <div className="min-h-screen bg-neutral-50 px-5 py-10 sm:px-8 sm:py-14">
            <div className="mx-auto max-w-6xl">
               {/* Hero */}
               <header className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex items-start gap-5">
                     <svg viewBox="0 0 48 48" fill="none" className="mt-1 h-12 w-12 shrink-0 text-emerald-600" aria-hidden="true">
                        <circle className="oc-ring" cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
                        <path className="oc-tick" d="M15 25l7 7 12-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                     <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-headingColor sm:text-4xl">Order confirmed</h1>
                        <div className="mt-2 max-w-xl text-lightText">
                           Thank you, {firstName}. We&apos;ve received your order and will start processing it shortly
                           {shippingInfo.email ? (
                              <>
                                 . Updates will go to <span className="text-headingColor">{shippingInfo.email}</span>.
                              </>
                           ) : (
                              "."
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-1 lg:items-end">
                     <div className="text-sm text-lightText">Order number</div>
                     <div className="flex items-center gap-2">
                        <span className="break-all font-mono text-sm text-headingColor sm:text-base">{orderRef}</span>
                        <button
                           type="button"
                           onClick={handleCopy}
                           aria-label={copied ? "Order number copied" : "Copy order number"}
                           className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                        >
                           {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                     </div>
                     {placedLabel && <div className="text-sm text-lightText">Placed on {placedLabel}</div>}
                  </div>
               </header>

               <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
                  {/* Left: one sheet, three sections */}
                  <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                     {/* Status */}
                     <section className="p-6 sm:p-8">
                        <div className="mb-8 flex items-center justify-between gap-4">
                           <h2 className="text-lg font-semibold text-headingColor">Order status</h2>
                           <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-headingColor">{isCancelled ? "Cancelled" : STEPS[stepIndex].label}</span>
                        </div>

                        {isCancelled ? (
                           <div className="text-lightText">This order was cancelled. If you didn&apos;t request this, please contact customer support.</div>
                        ) : (
                           <ol className="relative grid grid-cols-4">
                              {/* track */}
                              <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-px bg-neutral-200" aria-hidden="true">
                                 <div className="h-full bg-neutral-900 transition-all duration-700" style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
                              </div>

                              {STEPS.map(({ key, label, Icon }, i) => {
                                 const done = i < stepIndex || statusVal === "delivered";
                                 const active = i === stepIndex && statusVal !== "delivered";
                                 return (
                                    <li key={key} aria-current={active ? "step" : undefined} className="relative z-10 flex flex-col items-center gap-3">
                                       <div
                                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${done ? "border-neutral-900 bg-neutral-900 text-white" : active ? "border-neutral-900 bg-neutral-900 text-white ring-4 ring-neutral-900/10" : "border-neutral-300 bg-white text-neutral-400"}`}
                                       >
                                          <Icon className="h-4 w-4" />
                                       </div>
                                       <div className={`text-center text-sm ${done || active ? "font-medium text-headingColor" : "text-lightText"}`}>{label}</div>
                                    </li>
                                 );
                              })}
                           </ol>
                        )}
                     </section>

                     {/* Items */}
                     <section className="p-6 sm:p-8">
                        <div className="mb-6 flex items-baseline justify-between gap-4">
                           <h2 className="text-lg font-semibold text-headingColor">Items</h2>
                           <span className="text-sm text-lightText">
                              {totalUnits} {totalUnits === 1 ? "item" : "items"}
                           </span>
                        </div>
                        <ul className="divide-y divide-neutral-100">
                           {itemsList.map((item, index) => {
                              const itemName = (item as any).name || (item as any).productName || "Product";
                              const itemImg = item.image || item.thumbnail || "";
                              return (
                                 <li key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">{itemImg && <img src={itemImg} alt={itemName} loading="lazy" className="h-full w-full object-cover" />}</div>
                                    <div className="min-w-0 flex-1">
                                       <div className="truncate font-medium text-headingColor">{itemName}</div>
                                       <div className="mt-1 text-sm tabular-nums text-lightText">
                                          {item.quantity} × {money(item.price)}
                                       </div>
                                    </div>
                                    <div className="font-medium tabular-nums text-headingColor">{money(item.price * item.quantity)}</div>
                                 </li>
                              );
                           })}
                        </ul>
                     </section>

                     {/* Delivery */}
                     <section className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
                        <div>
                           <h2 className="mb-3 text-lg font-semibold text-headingColor">Shipping to</h2>
                           <div className="space-y-0.5 text-lightText">
                              <div className="font-medium text-headingColor">{shippingInfo.fullName}</div>
                              <div>{shippingInfo.address}</div>
                              {addressLine2 && <div>{addressLine2}</div>}
                              <div>{shippingInfo.country}</div>
                           </div>
                        </div>
                        <div>
                           <h2 className="mb-3 text-lg font-semibold text-headingColor">Contact</h2>
                           <div className="space-y-0.5 text-lightText">
                              {shippingInfo.phone && <div>{shippingInfo.phone}</div>}
                              {shippingInfo.email && <div className="break-all">{shippingInfo.email}</div>}
                           </div>
                           {order.notes && (
                              <div className="mt-4 text-sm text-lightText">
                                 <span className="text-headingColor">Note: </span>
                                 {order.notes}
                              </div>
                           )}
                        </div>
                     </section>
                  </div>

                  {/* Right: receipt ticket */}
                  <aside className="lg:sticky lg:top-6">
                     <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                        <div className="p-6 sm:p-8">
                           <h2 className="mb-5 text-lg font-semibold text-headingColor">Summary</h2>
                           <dl className="space-y-3 text-[15px]">
                              <div className="flex justify-between gap-4">
                                 <dt className="text-lightText">Subtotal</dt>
                                 <dd className="tabular-nums text-headingColor">{money(subtotalVal)}</dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                 <dt className="text-lightText">Shipping</dt>
                                 <dd className="tabular-nums text-headingColor">{shippingVal > 0 ? money(shippingVal) : "Free"}</dd>
                              </div>
                              {taxVal > 0 && (
                                 <div className="flex justify-between gap-4">
                                    <dt className="text-lightText">Tax</dt>
                                    <dd className="tabular-nums text-headingColor">{money(taxVal)}</dd>
                                 </div>
                              )}
                              <div className="flex items-center justify-between gap-4 pt-1">
                                 <dt className="text-lightText">Payment</dt>
                                 <dd>
                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${isPaid ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                                       <span className={`h-1.5 w-1.5 rounded-full ${isPaid ? "bg-emerald-600" : "bg-amber-500"}`} />
                                       {capitalize(paymentVal)}
                                    </span>
                                 </dd>
                              </div>
                           </dl>
                        </div>

                        {/* Perforation */}
                        <div className="relative h-0" aria-hidden="true">
                           <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-neutral-200 bg-neutral-50" />
                           <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-neutral-200 bg-neutral-50" />
                        </div>

                        <div className="bg-BtnBlack p-6 text-white sm:p-8">
                           <div className="text-sm text-white/60">Total</div>
                           <div className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{money(totalVal)}</div>

                           <button
                              type="button"
                              onClick={handleDownload}
                              disabled={downloadState === "working"}
                              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-BtnBlack transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
                           >
                              {downloadState === "working" ? <Loader2 className="h-4 w-4 animate-spin" /> : downloadState === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                              <span aria-live="polite">{downloadLabel}</span>
                           </button>
                        </div>
                     </div>

                     <Link
                        href="/"
                        className="mt-4 flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 font-medium text-headingColor transition-colors hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                     >
                        Continue shopping
                     </Link>
                     <div className="mt-4 text-center text-sm text-lightText">Questions about this order? Contact our customer support with your order number.</div>
                  </aside>
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default OrderConfirmation;
