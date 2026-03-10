import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = () => {
   return (
      <Link href={"/product/dan"} className="group cursor-pointer  overflow-hidden   relative">
         <div className="w-full h-full relative flex flex-col gap-3">
            <div className="relative ">
               <Image width={500} height={800} src={"/Dummy/Product/ProductImg.png"} alt="Category Image Here" className="object-fill max-[600px]:w-full" />
               <div className="flex w-full justify-between absolute xl:top-8 top-6 left-0">
                  <span className="bg-BtnBlack py-1.5 px-4 rounded-r-full ">
                     <p className="text-white max-xl:text-[10px]!">Hot Sellers</p>
                  </span>
               </div>
               <div className="absolute top-0 xl:right-6 right-5 flex flex-col gap-2 justify-between h-full xl:py-8 py-6">
                  <Image src={"/Icons/HeartIcon.svg"} width={20} height={20} alt="profile icon" className="w-6 max-xl:w-[2vw]! max-lg:w-5! hover:scale-105" />
                  <Image src={"/Icons/AddIcon.svg"} width={20} height={20} alt="profile icon" className="w-6 max-xl:w-[2vw]! max-lg:w-5! hover:scale-105 " />
               </div>
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
               <div className="flex items-center gap-4">
                  <p>Rs 11,999</p>
                  <span className="py-0.5 px-2 bg-BtnBlack">
                     <p className="text-white">-80% Rs 2500</p>
                  </span>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default ProductCard;
