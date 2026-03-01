import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import MainLayout from "@/layout/MainLayout";
import React from "react";

const page = () => {
   return (
      <MainLayout>
         <div className="flex flex-col lg:gap-10 gap-5 lg:px-10 px-5 pt-17.5">
            <div>
               <h2 className="uppercase">Enjoy our feature products</h2>
               <p>Created for those who value quality, enjoy limited offers on thoughtfully crafted pieces.</p>
            </div>
            <div>
               
            </div>
         </div>
         {/* <section className=" my-10!">
            <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-2 gap-10">
               {[1, 2, 3, 4].map((_, i) => (
                  <ProductCard key={i} />
               ))}
            </div>
         </section> */}
      </MainLayout>
   );
};

export default page;
