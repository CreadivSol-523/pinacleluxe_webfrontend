"use client";
import { useGetWebSectionsHandler } from "@/modals/WebSectionsModal";
import { useCartStore } from "@/Storage/UseCartStore";
import { TopBarConfig } from "@/Types/WebSection/WebSection";
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
   isStyle?: boolean;
   setIsFilter?: (value: boolean) => void;
};

const MainLayout = ({ children, isHeader = true, isFooter = true, isFilter, setIsFilter, isStyle = true }: MainLayoutType) => {
   // const [isCartOpen, setIsCartOpen] = useState(false);
   const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

   const { setCartOpen } = useCartStore();
   const isCartOpen = useCartStore((state) => state.isCartOpen);

   // Get Websection API
   const { data, isLoading: getWebSectionLoading } = useGetWebSectionsHandler();
   const sections = data?.data || [];

   const topbar = sections.find((section: any) => section.type === "topbar");
   const isTopbarEnabled = topbar?.data.enabled;

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
         <div onClick={() => setCartOpen(false)} className={isCartOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Cart isOpen={isCartOpen} setIsSidebarOpen={setCartOpen} />
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
            <header className={`${isCartOpen || isFavoriteOpen ? "fixed w-full z-50" : "fixed w-full z-60 delay-500"}`}>
               {isTopbarEnabled && <TopBar topbarData={topbar?.data as TopBarConfig} />}
               <Header setIsSidebarOpen={setCartOpen} setIsFavoriteOpen={setIsFavoriteOpen} />
            </header>
         ) : (
            isTopbarEnabled && <TopBar topbarData={topbar?.data as TopBarConfig} />
         )}
         {isStyle ? <div className={isTopbarEnabled ? "pt-28.5!" : "pt-17.5!"}>{children}</div> : <div>{children}</div>}
         {isFooter && <Footer />}
      </main>
   );
};

export default MainLayout;
