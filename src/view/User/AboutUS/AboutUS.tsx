import MainLayout from "@/layout/MainLayout";
import ImageSection from "@/ui/User/AboutUS/ImageSection/ImageSection";
import TagLine from "@/ui/User/AboutUS/TagLine/TagLine";
import BannerSection from "@/ui/User/Home/BannerSection/BannerSection";
import Image from "next/image";
import React from "react";

const AboutUS = () => {
   return (
      <MainLayout>
         <div className="flex flex-col lg:gap-10 gap-5">
            <div className="flex flex-col gap-17.5 pb-17.5">
               <BannerSection />
               <TagLine />
               <ImageSection />
            </div>
         </div>
      </MainLayout>
   );
};

export default AboutUS;
