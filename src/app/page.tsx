import MainLayout from "@/layout/MainLayout";
import Footer from "@/ui/Footer/Footer";
import BannerSection from "@/ui/Home/BannerSection/BannerSection";
import CarouselSection from "@/ui/Home/CarouselSection/CarouselSection";
import CategorySection from "@/ui/Home/CategorySection/CategorySection";
import ReferSection from "@/ui/Home/ReferSection/ReferSection";
import SaleBanner from "@/ui/Home/SaleBanner/SaleBanner";
import VideoSection from "@/ui/Home/VideoSection/VideoSection";

export default function Home() {
   return (
      <MainLayout>
         <div className="flex flex-col lg:gap-10 gap-5">
            <div>
               <SaleBanner />
               <BannerSection />
            </div>
            <CategorySection />
            <VideoSection />
            <ReferSection />
            <CarouselSection />
         </div>
      </MainLayout>
   );
}
