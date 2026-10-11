import { HeroConfig } from "@/Types/WebSection/WebSection";
import Image from "next/image";

const BannerSection = ({ heroData }: { heroData: HeroConfig }) => {
   const desktopImage = typeof heroData.desktopImage === "string" ? heroData.desktopImage : "/Dummy/Home/Banner.png";

   const mobileImage = typeof heroData.mobileImage === "string" ? heroData.mobileImage : desktopImage;

   return (
      <section className="w-full">
         <picture>
            <source media="(max-width: 767px)" srcSet={mobileImage} />

            <Image src={desktopImage} width={1920} height={800} alt="Banner" className="w-full h-auto object-contain" priority unoptimized />
         </picture>
      </section>
   );
};

export default BannerSection;
