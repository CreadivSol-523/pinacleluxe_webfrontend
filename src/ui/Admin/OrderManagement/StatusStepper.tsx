import { OrderStatus } from "@/Types/Order/OrderType";

const STATUS_STEPS: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];

// ── Status stepper ────────────────────────────────────────────────────────────
export function StatusStepper({ status }: { status: OrderStatus }) {
   const cancelled = status === "Cancelled";
   const currentIdx = STATUS_STEPS.indexOf(status);

   return (
      <div className="flex items-center">
         {STATUS_STEPS.map((step, i) => {
            const done = !cancelled && currentIdx >= i;
            const active = !cancelled && currentIdx === i;
            return (
               <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                     <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium border-2 transition-all
                        ${done ? "bg-[#B8975A] border-[#B8975A] text-white" : "border-[#B8975A]/20 text-[#5E5F60]"}
                        ${active ? "ring-2 ring-[#B8975A]/25 ring-offset-1" : ""}`}
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
                  {i < STATUS_STEPS.length - 1 && <div className={`h-px w-10 sm:w-16 mb-4 mx-1 transition-colors ${done && currentIdx > i ? "bg-[#B8975A]" : "bg-[#B8975A]/15"}`} />}
               </div>
            );
         })}
         {cancelled && <span className="ml-4 text-[11px] text-red-500 font-medium">Cancelled</span>}
      </div>
   );
}
