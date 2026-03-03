import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

const SidebarCard = () => {
   return (
      <div className="flex items-center gap-3 ">
         <Image src="/Dummy/Product/ProductImg2.png" alt="sidebar card" width={90} height={150} />
         <div className="flex flex-col justify-between h-full! gap-2 ">
            <p className="text-lg!">Easy Zipper Tote</p>
            <p style={{ fontFamily: "InterMedium", fontWeight: 500 }} className="text-xl!">
               $65.00
            </p>
            <div className="flex items-center gap-3 px-4 py-1 border border-gray-400 rounded-full w-fit">
               <Minus className="w-4 h-4" />
               <p>1</p>
               <Plus className="w-4 h-4" />
            </div>
         </div>
      </div>
   );
};

export default SidebarCard;
