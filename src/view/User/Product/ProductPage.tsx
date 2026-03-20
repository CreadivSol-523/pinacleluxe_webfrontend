import MainLayout from "@/layout/MainLayout";
import React from "react";
import SingleProductSection from "@/ui/User/Product/SingleProductSection/SingleProductSection";
import ThreeTabsSection from "@/ui/User/Product/ThreeTabsSection/ThreeTabsSection";
import IntrestedInSection from "@/ui/User/Product/IntrestedInSection/IntrestedInSection";

const ProductPage = () => {
   return (
      <MainLayout>
         <div className="flex flex-col md:gap-17.5 gap-10.5  md:py-17.5 pb-10.5">
            <SingleProductSection />
            <ThreeTabsSection />
            <IntrestedInSection />
            <div className="w-full h-px bg-gray-300 lg:px-10 px-5" />
            <IntrestedInSection />
         </div>
      </MainLayout>
   );
};

export default ProductPage;
