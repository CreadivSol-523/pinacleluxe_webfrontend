"use client";
import Footer from "@/ui/Footer/Footer";
import Header from "@/ui/Header/Header";
import TopBar from "@/ui/TopBar/TopBar";
import React, { ReactNode, useEffect, useState } from "react";

type MainLayoutType = {
   children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutType) => {
   const [bodyHeight, setBodyHeight] = useState(0);
   useEffect(() => {
      const handleResizeOrScroll = () => {
         const fullHeight = document.documentElement.scrollHeight;
         setBodyHeight(fullHeight);
      };

      // Run once on mount
      handleResizeOrScroll();

      window.addEventListener("scroll", handleResizeOrScroll);
      window.addEventListener("resize", handleResizeOrScroll);

      return () => {
         window.removeEventListener("scroll", handleResizeOrScroll);
         window.removeEventListener("resize", handleResizeOrScroll);
      };
   }, []);

   return (
      <main className="overflow-hidden!">
         <div className="h-28.5">
            <TopBar />
            <Header />
         </div>
         <div>{children}</div>
         <Footer />
      </main>
   );
};

export default MainLayout;
