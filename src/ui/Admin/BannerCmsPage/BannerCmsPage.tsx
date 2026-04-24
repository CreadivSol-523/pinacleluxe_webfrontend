"use client";
import { useState } from "react";
import ChangeSalesBanner from "./ChangeSalesBanner/ChangeSalesBanner";
import ChangeTopBar from "./TopBar/TopBar";
import ChangeHeroSection from "./Changeherosection/Changeherosection";
import ChangeMediaSection from "./Changemediasection/Changemediasection";

type Section = "topbar" | "salesbanner" | "hero" | "media";

const sections: { key: Section; label: string }[] = [
   { key: "topbar", label: "Top Bar" },
   { key: "salesbanner", label: "Sales Banner" },
   { key: "hero", label: "Hero" },
   { key: "media", label: "Image / Video" },
];

export default function BannerCmsPage() {
   const [active, setActive] = useState<Section>("topbar");

   return (
      <div className="flex flex-col gap-8 p-6">
         {/* Page header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="font-serif text-[24px] font-semibold text-headingColor tracking-[0.02em]">Banner & CMS</h1>
               <p className="text-[12px] text-[#5E5F60] mt-1">Manage banners, announcements, and homepage sections</p>
            </div>
            <div className="flex items-center gap-2">
               {sections.map((s) => (
                  <button
                     key={s.key}
                     onClick={() => setActive(s.key)}
                     className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all duration-150
                        ${active === s.key ? "bg-primaryBG text-[#B8975A] border-[#B8975A]/20" : "bg-[#F5F0E8] text-[#5E5F60] border-[#B8975A]/10 hover:text-headingColor hover:border-[#B8975A]/30"}`}
                  >
                     {s.label}
                  </button>
               ))}
               <span className="px-3 py-1.5 bg-[#F5F0E8] text-[#5E5F60] text-[11px] rounded-full border border-[#B8975A]/10 opacity-40 cursor-not-allowed">+ More</span>
            </div>
         </div>

         {active === "topbar" && <ChangeTopBar />}
         {active === "salesbanner" && <ChangeSalesBanner />}
         {active === "hero" && <ChangeHeroSection />}
         {active === "media" && <ChangeMediaSection />}
      </div>
   );
}
