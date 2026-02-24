import Image from "next/image";
import React from "react";

const CategoryCards = () => {
   return (
      <div className="relative  2xl:h-140 xl:h-110 lg:h-[21em] max-lg:h-100 max-[850px]:h-120 max-[600px]:h-150! max-[450px]:h-120! ">
         <div className="w-full" style={{ paddingTop: "125%" }}>
            <Image src="/Dummy/Home/CategoryImg.png" alt="Category Image Here" layout="fill" className="object-fill" />
            <div className="absolute inset-0 flex items-end justify-start p-4">
               <h3 className="text-white max-xl:text-xl! max-sm:text-md!">Totes</h3>
            </div>
         </div>
      </div>
   );
};

export default CategoryCards;
