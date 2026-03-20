"use client";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "../../../../DummyData/Products.json";
import Button from "@/components/Button/Button";

const TabsSection = ({ isFilter, setIsFilter }: { isFilter: boolean; setIsFilter: (value: boolean) => void }) => {
   const [selectedTab, setSelectedTab] = useState("Hot Sellers");
   const [selectedColor, setSelectedColor] = useState({ hex: "", image: "" });

   const scrollRef = useRef<HTMLDivElement>(null);

   const Tabs = ["Hot Sellers", "Pinacle Special", "New Arrival", "New Arrival", "New Arrival", "New Arrival", "New Arrival", "New Arrival"];

   const scroll = (dir: "left" | "right") => {
      if (scrollRef.current) {
         scrollRef.current.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
      }
   };

   useEffect(() => {
      if (isFilter) {
         // Disable scroll
         document.body.style.overflow = "hidden";
      } else {
         // Enable scroll
         document.body.style.overflow = "auto";
      }

      // Clean up in case component unmounts
      return () => {
         document.body.style.overflow = "auto";
      };
   }, [isFilter]);

   return (
      <div className={`sm:sticky relative  z-50! top-17.5  bg-white`}>
         <div className="w-full flex flex-col gap-4 pt-4 ">
            <div className="flex md:items-center justify-between max-md:flex-col max-md:gap-4 py-2  bg-white ">
               <div className="flex items-center gap-2">
                  <button onClick={() => scroll("left")} className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition">
                     <ChevronLeft className="text-[#8D8D8D]" size={20} />
                  </button>

                  <div ref={scrollRef} className="flex items-center gap-4.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 xl:max-w-200 lg:max-w-130 md:max-w-100 max-w-full">
                     {Tabs.map((tab, i) => (
                        <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 shrink-0 ${selectedTab === tab ? "border-BtnBlack bg-BtnBlack" : "border-BtnBlack bg-white"}`} onClick={() => setSelectedTab(tab)}>
                           <p className={`${selectedTab === tab ? "text-white" : "text-textBlack"} fontInterMedium! font-semibold! tracking-wide`}>{tab}</p>
                        </div>
                     ))}
                  </div>

                  <button onClick={() => scroll("right")} className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition">
                     <ChevronRight className="text-[#8D8D8D]" size={20} />
                  </button>
               </div>
               <div className="flex items-center sm:gap-20 gap-5">
                  <span className="flex items-center gap-1.5 cursor-pointer">
                     <p className="text-[#8D8D8D] max-[700px]:pl-4 max-sm:text-[12px]!">Sort</p>
                     <ChevronDown className={`text-[#8D8D8D] ${isFilter ? "rotate-180" : "rotate-0"} transition-all duration-300`} />
                  </span>
                  <p className="text-[#8D8D8D] cursor-pointer max-[700px]:pl-4 max-sm:text-[12px]!" onClick={() => setIsFilter(!isFilter)}>
                     Filter
                  </p>
               </div>
            </div>
            <div className="w-full h-px bg-gray-200" />
         </div>
         <div className={`${isFilter ? "max-h-200 opacity-100" : "max-h-0 opacity-0"} max-sm:hidden   pb-10 flex flex-col gap-4 overflow-hidden transition-all duration-400 bg-white absolute z-70! sm:top-full top-0 right-full left-0 w-full`}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
               <h2 className="text-headingColor">Filters</h2>
               <X className="text-textBlack cursor-pointer" size={30} onClick={() => setIsFilter(false)} />
            </div>
            <div className="pb-5 xl:pt-12 pt-6 sm:px-15 px-4 flex max-sm:flex-col items-start sm:justify-around justify-start max-sm:gap-10 flex-wrap">
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
            <div className="px-4">
               <Button name="Apply" className="w-full" />
            </div>
         </div>
         <div className={`${isFilter ? "sm:h-screen h-[300vh]" : "h-0 opacity-0 pointer-events-none"} transition-all duration-300 bg-black/20 absolute z-60! sm:top-full -top-100  left-1/2 -translate-x-1/2 w-screen`}></div>
      </div>
   );
};

export default TabsSection;
