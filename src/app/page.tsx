import MainLayout from "@/layout/MainLayout";
import BannerSection from "@/ui/Home/BannerSection/BannerSection";
import CategorySection from "@/ui/Home/CategorySection/CategorySection";
import SaleBanner from "@/ui/Home/SaleBanner/SaleBanner";

export default function Home() {
   return (
      <MainLayout>
         <div className="flex flex-col gap-10">
            <div>
               {/* <SaleBanner /> */}
               <BannerSection />
            </div>
            <CategorySection />
            <BannerSection />
         </div>
      </MainLayout>
   );
}
