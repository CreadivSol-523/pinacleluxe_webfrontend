"use client";
import Cart from "@/ui/Cart/Cart";
import Footer from "@/ui/Footer/Footer";
import Header from "@/ui/Header/Header";
import TopBar from "@/ui/TopBar/TopBar";
import React, { ReactNode, useEffect, useState } from "react";

type MainLayoutType = {
   children: ReactNode;
   isHeader?: boolean;
   isFooter?: boolean;
};

const MainLayout = ({ children, isHeader = true, isFooter = true }: MainLayoutType) => {
   const [isCartOpen, setIsCartOpen] = useState(false);

   useEffect(() => {
      if (isCartOpen) {
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
   }, [isCartOpen]);

   return (
      <main>
         <div onClick={() => setIsCartOpen(false)} className={isCartOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Cart isOpen={isCartOpen} setIsSidebarOpen={setIsCartOpen} />
            </div>
         </div>
         {isHeader ? (
            <div className={`h-28.5 relative  ${isCartOpen ? "z-50 " : "z-60 delay-500"}`}>
               <TopBar />
               <Header setIsSidebarOpen={setIsCartOpen} />
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
