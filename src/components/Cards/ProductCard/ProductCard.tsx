import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import React from "react";

const ProductCard = () => {
   return (
      <div className="group cursor-pointer  overflow-hidden   relative">
         <div className="w-full h-full relative flex flex-col gap-3">
            <div>
               <img src={"/Dummy/Product/ProductImg.png"} alt="Category Image Here" className="object-fill " />
            </div>
            <div className=" flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <div className="bg-amber-900 xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
                  <div className="bg-amber-700 xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
                  <div className="bg-blue-700 xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
                  <div className="bg-cyan-500 xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
                  <div className="bg-fuchsia-500 xl:w-4.5 xl:h-4.5 w-3.5 h-3.5 rounded-full" />
               </div>
               <h3 className="2xl:text-[20px]! xl:text-[19px]! text-[16px]! fontInterRegular">Easy Zipper Tote Bag</h3>
               <p>Rs 11,999</p>
            </div>
         </div>
      </div>
   );
};

export default ProductCard;
