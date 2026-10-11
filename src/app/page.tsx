import MainLayout from "@/layout/MainLayout";
import { getWebSections } from "@/modals/WebSectionsModal";
import { SalesBannerConfig } from "@/Types/WebSection/WebSection";
import Footer from "@/ui/User/Footer/Footer";
import BannerSection from "@/ui/User/Home/BannerSection/BannerSection";
import CarouselSection from "@/ui/User/Home/CarouselSection/CarouselSection";
import CategorySection from "@/ui/User/Home/CategorySection/CategorySection";
import ReferSection from "@/ui/User/Home/ReferSection/ReferSection";
import SaleBanner from "@/ui/User/Home/SaleBanner/SaleBanner";
import VideoSection from "@/ui/User/Home/VideoSection/VideoSection";

export default async function Home() {
   const sections = await getWebSections();

   const salesbanner = sections.find((section: any) => section.type === "salesbanner");

   const hero = sections.find((section: any) => section.type === "hero");

   const media = sections.find((section: any) => section.type === "media");

   const carousel = sections.find((section: any) => section.type === "carousel");

   return (
      <MainLayout>
         <div className="flex flex-col lg:gap-10 gap-5">
            <div>
               {salesbanner?.data && (salesbanner.data as SalesBannerConfig)?.enabled && <SaleBanner salesBannerData={salesbanner.data as SalesBannerConfig} />}

               {hero?.data && <BannerSection heroData={hero.data} />}
            </div>

            <CategorySection />

            {media?.data && <VideoSection mediaData={media.data} />}

            <ReferSection />

            {carousel?.data && <CarouselSection carouselData={carousel.data} />}
         </div>
      </MainLayout>
   );
}
