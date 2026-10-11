"use client";
import { TopBarConfig } from "@/Types/WebSection/WebSection";
import React, { useEffect } from "react";

const TopBar = ({ topbarData }: { topbarData: TopBarConfig }) => {
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
      <div
         id="topbar"
         className={`${topbarData.bgColor ? `bg-[${topbarData.bgColor}]` : "bg-primaryBG"} ${topbarData.textColor ? `text-[${topbarData.textColor}]` : "text-white"} h-11 flex items-center justify-center z-50`}
         style={{
            backgroundColor: topbarData.bgColor || undefined,
            color: topbarData.textColor || undefined,
         }}
      >
         <p className="text-center">{topbarData.message ?? "Archive Sale: New markdowns are here. Enjoy up to 60% off."}</p>
      </div>
   );
};

export default TopBar;
