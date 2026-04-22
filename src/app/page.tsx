import MainLayout from "@/layout/MainLayout";
import Footer from "@/ui/User/Footer/Footer";
import BannerSection from "@/ui/User/Home/BannerSection/BannerSection";
import CarouselSection from "@/ui/User/Home/CarouselSection/CarouselSection";
import CategorySection from "@/ui/User/Home/CategorySection/CategorySection";
import ReferSection from "@/ui/User/Home/ReferSection/ReferSection";
import SaleBanner from "@/ui/User/Home/SaleBanner/SaleBanner";
import VideoSection from "@/ui/User/Home/VideoSection/VideoSection";

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
