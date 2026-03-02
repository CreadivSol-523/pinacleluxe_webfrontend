import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import MainLayout from "@/layout/MainLayout";
import HeadingSection from "@/ui/Category/HeadingSection/HeadingSection";
import Image from "next/image";
import React from "react";

const page = () => {
   return (
      <MainLayout>
         <div className="flex flex-col  lg:px-10 px-5 pt-17.5 gap-16 pb-21.25">
            <HeadingSection />
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((_, i) => (
                     <ProductCard key={i} />
                  ))}
               </div>
            </section>
            <section className="grid  max-lg:grid-cols-1! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
               <div className="flex gap-y-21.25 lg:flex-col lg:gap-x-0 gap-x-4">
                  {[1, 2].map((_, i) => (
                     <ProductCard key={i} />
                  ))}
               </div>
               <Image src={"/Dummy/PersonImage.png"} width={800} height={1000} alt="Center Person Image" className=" col-span-2 w-full 2xl:h-[93.4%] xl:h-[91%] lg:h-[90%]" />
               <div className="flex gap-y-21.25 lg:flex-col lg:gap-x-0 gap-x-4">
                  {[1, 2].map((_, i) => (
                     <ProductCard key={i} />
                  ))}
               </div>
            </section>
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((_, i) => (
                     <ProductCard key={i} />
                  ))}
               </div>
            </section>
         </div>
      </MainLayout>
   );
};

export default page;
