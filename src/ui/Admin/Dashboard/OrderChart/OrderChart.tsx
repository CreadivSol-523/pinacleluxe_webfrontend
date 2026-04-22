import { useState } from "react";

const ordersGraph = [
   { day: "Mon", orders: 18 },
   { day: "Tue", orders: 32 },
   { day: "Wed", orders: 27 },
   { day: "Thu", orders: 45 },
   { day: "Fri", orders: 38 },
   { day: "Sat", orders: 52 },
   { day: "Sun", orders: 34 },
];
function OrdersChart() {
   const max = Math.max(...ordersGraph.map((d) => d.orders));
   const [hovered, setHovered] = useState<number | null>(null);

   return (
      <div className="flex items-end gap-2 2xl:h-30 h-100 w-full">
         {ordersGraph.map((d, i) => {
            const heightPct = (d.orders / max) * 100;
            const isHovered = hovered === i;
            return (
               <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                  {isHovered && <span className="text-[10px] font-medium text-headingColor bg-staticSecondaryBG border border-[#B8975A]/20 px-1.5 py-0.5 rounded">{d.orders}</span>}
                  <div
                     className="w-full rounded-t-sm transition-all duration-200"
                     style={{
                        height: `${heightPct}%`,
                        background: isHovered ? "#B8975A" : "#B8975A33",
                     }}
                  />
                  <span className="text-[10px] text-[#5E5F60]">{d.day}</span>
               </div>
            );
         })}
      </div>
   );
}

export default OrdersChart;
