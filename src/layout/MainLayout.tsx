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

   return (
      <main className="overflow-hidden!">
         <div onClick={() => setIsCartOpen(false)} className={isCartOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Cart isOpen={isCartOpen} setIsSidebarOpen={setIsCartOpen} />
            </div>
         </div>
         {isHeader ? (
            <div className="h-28.5">
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
