import { X } from "lucide-react";
import React, { useState } from "react";
import { products } from "../../DummyData/Products.json";
import Button from "@/components/Button/Button";

const FilterSheet = ({ isOpen, setIsSidebarOpen }: { isOpen?: boolean; setIsSidebarOpen?: (isOpen: boolean) => void }) => {
   const [selectedColor, setSelectedColor] = useState({ hex: "", image: "" });

   return (
      <aside className={`sm:w-100 w-full h-full bg-white fixed transition-all duration-500 ${isOpen ? "sm:right-0 translate-x-0" : "sm:-right-full  translate-x-full"} z-60!`}>
         <div className="p-5 flex justify-between items-center border-b border-b-gray-200">
            <h3>Favorite Items</h3>
            <X className="cursor-pointer" onClick={() => setIsSidebarOpen?.(false)} />
         </div>
         <div className="flex flex-col items-start  justify-start px-6 h-full gap-5">
            <div className="pb-5 pt-10 sm:px-15 px-4 flex flex-col items-start  justify-start gap-10  h-[75vh] w-full overflow-y-scroll overflow-x-hidden ">
               <div className="flex flex-col gap-2">
                  <h4 className="text-textBlack">Colors</h4>
                  <div className="flex items-center flex-wrap gap-2">
                     {products?.[0]?.colors?.map((item, i) =>
                        selectedColor.hex === item.hex ? (
                           <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item.hex}>
                              <div className={`w-4 h-4 rounded-full bg-[${item.hex}]`} style={{ background: item.hex }} />
                           </div>
                        ) : (
                           <div onClick={() => setSelectedColor({ hex: item.hex, image: item.image })} className={`w-6 h-6 cursor-pointer rounded-full ${item.hex}`} style={{ background: item.hex }} key={i} />
                        ),
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <h4 className="text-textBlack">Features</h4>
                  <div className="flex items-center flex-wrap gap-2">
                     <ul className="flex flex-col gap-3">
                        <li>Monogramming (42)</li>
                        <li>Zipper closure (22)</li>
                        <li>Fits 13" Laptop (2)</li>
                        <li>Fits 16" Laptop (2)</li>
                        <li>Jo Malone Sakura Cherry Blossom</li>
                     </ul>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <h4 className="text-textBlack">Material</h4>
                  <div className="flex items-center flex-wrap gap-2">
                     <ul className="flex flex-col gap-3">
                        <li>3-Ply Silk (5)</li>
                        <li>Alpaca (4)</li>
                        <li>Bio Acetate (1)</li>
                        <li>Cashmere (7)</li>
                        <li>Croc-Embossed Leather (6)</li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="px-4 w-full">
               <Button name="Apply" className="w-full" />
            </div>
         </div>
      </aside>
   );
};

export default FilterSheet;
