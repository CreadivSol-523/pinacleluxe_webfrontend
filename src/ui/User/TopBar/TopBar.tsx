"use client";
import React, { useEffect } from "react";

const TopBar = () => {
   useEffect(() => {
      const topbar = document.getElementById("topbar");
      const onScroll = () => {
         if (window.scrollY > 44) {
            topbar?.style.setProperty("height", "0");
         } else {
            topbar?.style.setProperty("height", "44px");
         }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, []);
   return (
      <div id="topbar" className="bg-primaryBG text-white h-11 flex items-center justify-center  z-50">
         <p className="text-center">Archive Sale: New markdowns are here. Enjoy up to 60% off.</p>
      </div>
   );
};

export default TopBar;
