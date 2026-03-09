import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

const CheckoutCards = () => {
   return (
      <div className="flex items-center gap-6 ">
         <Image src="/Dummy/Product/ProductImg.png" alt="sidebar card" width={90} height={150} />
         <div className="flex flex-col justify-between  gap-2.5 ">
            <p className="text-headingColor">Jo Malone Sakura Cherry Blossom</p>
            <p style={{ fontFamily: "InterMedium", fontWeight: 500 }} className="text-lg! text-headingColor">
               Rs 11,999
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

export default CheckoutCards;
