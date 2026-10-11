"use client";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "../../../../DummyData/Products.json";
import Button from "@/components/Button/Button";
import { colorVariants } from "@/Types/Collection/CollectionTypes";

const TabsSection = ({
   isFilter,
   setIsFilter,
   filters,
   productFilters,
   applyFilter,
}: {
   isFilter: boolean;
   setIsFilter: (value: boolean) => void;
   filters: { badges: string[]; colors: string[]; materials: string[] };
   productFilters: { badge: string; category: string; material: string; color: string };
   applyFilter: (filters: any) => void;
}) => {
   const [selectedFilter, setSelectedFilter] = useState<{ color: string; material: string }>({ color: "", material: "" });

   const scrollRef = useRef<HTMLDivElement>(null);
   const stickyRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!isFilter) {
         document.body.style.overflow = "auto";
         return;
      }

      const el = stickyRef.current;
      const isDesktopSticky = window.matchMedia("(min-width: 640px)").matches; // sm: breakpoint jahan sticky/filter active hote hain

      let needsScroll = false;

      if (el && isDesktopSticky) {
         const rect = el.getBoundingClientRect();
         const stickyTop = parseFloat(getComputedStyle(el).top) || 0;

         // agar element abhi apni sticky-top position par "stuck" nahi hua (yani abhi neeche hai)
         needsScroll = rect.top > stickyTop + 1;

         if (needsScroll) {
            window.scrollBy({ top: rect.top - stickyTop, behavior: "smooth" });
         }
      }

      const lockScroll = () => {
         document.body.style.overflow = "hidden";
      };

      if (needsScroll) {
         // scroll animation complete hone ke baad hi body scroll lock karo,
         // warna overflow:hidden lagते hi smooth-scroll beech mein cut ho jayegi
         window.addEventListener("scrollend", lockScroll, { once: true });
      } else {
         lockScroll();
      }

      return () => {
         window.removeEventListener("scrollend", lockScroll);
         document.body.style.overflow = "auto";
      };
   }, [isFilter]);

   const handleApplyFilter = () => {
      if (selectedFilter.color === "" && selectedFilter.material === "") {
         return;
      }
      applyFilter({ ...productFilters, material: selectedFilter.material, color: selectedFilter.color });
      setIsFilter(false);
   };

   return (
      <div ref={stickyRef} className={`sm:sticky relative z-50! top-17.5  bg-white`}>
         <div className="w-full flex flex-col gap-4 pt-4 ">
            <div className="flex md:items-center justify-between max-md:flex-col max-md:gap-4 py-2  bg-white ">
               <div className="flex items-center gap-2">
                  <div ref={scrollRef} className="flex flex-wrap items-center gap-4.5  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 xl:max-w-200 lg:max-w-130 md:max-w-100 max-w-full">
                     {filters.badges.map((tab, i) => (
                        <div
                           key={i}
                           className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 shrink-0 ${(tab === "All" ? productFilters.badge === "" : productFilters.badge === tab) ? "border-BtnBlack bg-BtnBlack" : "border-BtnBlack bg-white"}`}
                           onClick={() => applyFilter(tab === "All" ? { ...productFilters, badge: "" } : { ...productFilters, badge: tab })}
                        >
                           <p className={`${(tab === "All" ? productFilters.badge === "" : productFilters.badge === tab) ? "text-white" : "text-textBlack"} fontInterMedium! font-semibold! tracking-wide`}>{tab}</p>
                        </div>
                     ))}
                  </div>
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
                     {filters.colors?.map((item, i) =>
                        selectedFilter.color === item ? (
                           <div className="w-6 h-6 border-2 border-gray-500 cursor-pointer  rounded-full flex items-center justify-center" key={item}>
                              <div className={`w-4 h-4 rounded-full bg-[${item}]`} style={{ background: item }} />
                           </div>
                        ) : (
                           <div onClick={() => setSelectedFilter({ ...selectedFilter, color: item })} className={`w-6 h-6 cursor-pointer rounded-full ${item}`} style={{ background: item }} key={i} />
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
                        {filters.materials.map((item, i) => {
                           return (
                              <li key={i} className={selectedFilter.material === item ? "list-disc" : "list-none"} onClick={() => setSelectedFilter({ ...selectedFilter, material: item })}>
                                 {item}
                              </li>
                           );
                        })}
                     </ul>
                  </div>
               </div>
            </div>
            <div className="px-4">
               <Button name="Apply" className="w-full" onClick={handleApplyFilter} />
            </div>
         </div>
         <div className={`${isFilter ? "sm:h-screen h-[300vh]" : "h-0 opacity-0 pointer-events-none"} transition-all duration-300 bg-black/20 absolute z-60! sm:top-full -top-100  left-1/2 -translate-x-1/2 w-screen`}></div>
      </div>
   );
};

export default TabsSection;
