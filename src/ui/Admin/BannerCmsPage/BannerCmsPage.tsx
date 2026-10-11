"use client";
import { useEffect, useState } from "react";
import ChangeSalesBanner from "./ChangeSalesBanner/ChangeSalesBanner";
import ChangeTopBar from "./TopBar/TopBar";
import ChangeHeroSection from "./Changeherosection/Changeherosection";
import ChangeMediaSection from "./Changemediasection/Changemediasection";
import { useCreateWebSectionHandler, useGetWebSectionsHandler, useUpdateWebSectionHandler } from "@/modals/WebSectionsModal";
import { CarouselConfig, HeroConfig, MediaSectionConfig, SalesBannerConfig, TopBarConfig } from "@/Types/WebSection/WebSection";
import ChangeCarouselSection from "./Changecarouselsection/Changecarouselsection";

type Section = "topbar" | "salesbanner" | "hero" | "media" | "carousel";

const sections: { key: Section; label: string }[] = [
   { key: "topbar", label: "Top Bar" },
   { key: "salesbanner", label: "Sales Banner" },
   { key: "hero", label: "Hero" },
   { key: "media", label: "Image / Video" },
   { key: "carousel", label: "Carousel" },
];

export default function BannerCmsPage() {
   const [active, setActive] = useState<Section>("topbar");
   const [sectionData, setSectionData] = useState({
      topBar: {},
      salesbanner: {},
      hero: {},
      media: {},
      carousel: {},
   });
   const { hero, media, salesbanner, topBar, carousel } = sectionData;

   // Handle Create WebSections API
   const { handleCreateWebSection, isLoading } = useCreateWebSectionHandler();

   // Get Websection API
   const { data, isLoading: getWebSectionLoading } = useGetWebSectionsHandler();

   // Handle Create WebSections API
   const { handleUpdateWebSection, isLoading: updateLoading } = useUpdateWebSectionHandler();

   useEffect(() => {
      if (!data?.data) return;

      const sections = data.data;

      const topbar = sections.find((section) => section.type === "topbar");

      const salesbanner = sections.find((section) => section.type === "salesbanner");

      const hero = sections.find((section) => section.type === "hero");

      const media = sections.find((section) => section.type === "media");

      const carousel = sections.find((section) => section.type === "carousel");

      setSectionData({
         topBar: { _id: topbar?._id, ...topbar?.data },

         salesbanner: { _id: salesbanner?._id, ...salesbanner?.data },

         hero: { _id: hero?._id, ...hero?.data },

         media: { _id: media?._id, ...media?.data },

         carousel: { _id: carousel?._id, ...carousel?.data },
      });
   }, [getWebSectionLoading]);

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

         {active === "topbar" && <ChangeTopBar handleSaveTopBar={(value) => handleCreateWebSection({ form: value, type: "topbar" })} handleUpdateTopBar={(value) => handleUpdateWebSection({ form: value, type: "topbar" })} isLoading={getWebSectionLoading} topbarData={topBar as TopBarConfig} />}
         {active === "salesbanner" && (
            <ChangeSalesBanner handleSaveSalesBanner={(value) => handleCreateWebSection({ form: value, type: "salesbanner" })} handleUpdateSalesBanner={(value) => handleUpdateWebSection({ form: value, type: "salesbanner" })} SalesBannerData={salesbanner as SalesBannerConfig} />
         )}
         {active === "hero" && <ChangeHeroSection handleSaveHero={(value) => handleCreateWebSection({ form: value, type: "hero" })} handleUpdateHero={(value) => handleUpdateWebSection({ form: value, type: "hero" })} initialHero={hero as HeroConfig} />}
         {active === "media" && <ChangeMediaSection handleSaveMedia={(value) => handleCreateWebSection({ form: value, type: "media" })} handleUpdateMedia={(value) => handleUpdateWebSection({ form: value, type: "media" })} initialMedia={media as MediaSectionConfig} />}
         {active === "carousel" && <ChangeCarouselSection handleSaveCarousel={(value) => handleCreateWebSection({ form: value, type: "carousel" })} handleUpdateCarousel={(value) => handleUpdateWebSection({ form: value, type: "carousel" })} initialCarousel={carousel as CarouselConfig} />}
      </div>
   );
}
