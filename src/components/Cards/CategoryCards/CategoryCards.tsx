import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import React from "react";

const CategoryCards = ({ img, heading }: { img: string; heading: string }) => {
   // 2xl:h-140 xl:h-105 lg:h-[21em] max-lg:h-100 max-[850px]:h-120 max-[600px]:h-150! max-[450px]:h-120!
   return (
      <AspectRatio ratio={4 / 5} className="group cursor-pointer overflow-hidden relative">
         <div className="w-full h-full relative">
            <Image src={img || "/Dummy/Home/CategoryImg.png"} alt="Category Image Here" fill className="object-fill transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-end justify-start p-6">
               <h3 className="text-white max-xl:text-lg! max-sm:text-md!">{heading || "Totes"}</h3>
            </div>
         </div>
      </AspectRatio>
   );
};

export default CategoryCards;
