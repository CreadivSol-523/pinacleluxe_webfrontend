"use client";
import Footer from "@/ui/Footer/Footer";
import Header from "@/ui/Header/Header";
import Sidebar from "@/ui/Sidebar/Sidebar";
import TopBar from "@/ui/TopBar/TopBar";
import React, { ReactNode, useEffect, useState } from "react";

type MainLayoutType = {
   children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutType) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   return (
      <main className="overflow-hidden!">
         <div onClick={() => setIsSidebarOpen(false)} className={isSidebarOpen ? "fixed w-full h-full z-60! bg-black/20 transition-all duration-500" : "fixed w-full h-full z-60! bg-transparent transition-all duration-500 pointer-events-none"}>
            <div onClick={(e) => e.stopPropagation()}>
               <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
         </div>
         <div className="h-28.5">
            <TopBar />
            <Header setIsSidebarOpen={setIsSidebarOpen} />
         </div>
         <div>{children}</div>
         <Footer />
      </main>
   );
};

export default MainLayout;
