"use client";
import Cart from "@/ui/User/Cart/Cart";
import Favorite from "@/ui/User/Favorite/Favorite";
import FilterSheet from "@/ui/User/FilterSheet/FilterSheet";
import Footer from "@/ui/User/Footer/Footer";
import Header from "@/ui/User/Header/Header";
import TopBar from "@/ui/User/TopBar/TopBar";
import React, { ReactNode, useEffect, useState } from "react";

type MainLayoutType = {
   children: ReactNode;
   isHeader?: boolean;
   isFooter?: boolean;
   isFilter?: boolean;
   setIsFilter?: (value: boolean) => void;
};

const MainLayout = ({ children, isHeader = true, isFooter = true, isFilter, setIsFilter }: MainLayoutType) => {
   const [isCartOpen, setIsCartOpen] = useState(false);
   const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

   useEffect(() => {
      if (isCartOpen || isFavoriteOpen) {
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
   }, [isCartOpen, isFavoriteOpen]);

   return (
      <main>
         <div onClick={() => setIsCartOpen(false)} className={isCartOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Cart isOpen={isCartOpen} setIsSidebarOpen={setIsCartOpen} />
            </div>
         </div>
         <div onClick={() => setIsFavoriteOpen(false)} className={isFavoriteOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Favorite isOpen={isFavoriteOpen} setIsSidebarOpen={setIsFavoriteOpen} />
            </div>
         </div>
         <div onClick={() => setIsFilter?.(false)} className={isFilter ? "fixed w-full h-full z-80! bg-black/20 transition-all duration-500 sm:hidden flex" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <FilterSheet isOpen={isFilter} setIsSidebarOpen={setIsFilter} />
            </div>
         </div>
         <div onClick={() => setIsFilter?.(false)} className={isFilter ? "fixed w-full h-full z-80! bg-black/20 transition-all duration-500 sm:hidden flex" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <FilterSheet isOpen={isFilter} setIsSidebarOpen={setIsFilter} />
            </div>
         </div>
         {isHeader ? (
            <div className={`h-28.5 relative  ${isCartOpen || isFavoriteOpen ? "z-50 " : "z-60 delay-500"}`}>
               <TopBar />
               <Header setIsSidebarOpen={setIsCartOpen} setIsFavoriteOpen={setIsFavoriteOpen} />
            </div>
         ) : (
            <TopBar />
         )}
         <div>{children}</div>
         {isFooter && <Footer />}
      </main>
   );
};

export default MainLayout;
