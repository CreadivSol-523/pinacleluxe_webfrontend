"use client";

import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import MainLayout from "@/layout/MainLayout";
import HeadingSection from "@/ui/Category/HeadingSection/HeadingSection";
import Image from "next/image";
import { products } from "@/DummyData/Products.json";
import { useState } from "react";
import { Product } from "@/Types/Collection/CollectionTypes";
import AddCartModal from "@/components/Modal/AddCartModal";
import TabsSection from "@/ui/Category/TabsSection/TabsSection";

const CollectionPage = () => {
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [isFilter, setIsFilter] = useState(false);

   return (
      <MainLayout isFilter={isFilter} setIsFilter={setIsFilter}>
         <div className="flex flex-col relative lg:px-10 px-5 pt-17.5 md:gap-16 gap-2 pb-21.25 ">
            <HeadingSection />
            <TabsSection isFilter={isFilter} setIsFilter={setIsFilter} />
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2   gap-x-4  gap-y-21.25">
                  {products.slice(0, 8).map((item, i) => (
                     <ProductCard key={i} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>
            <section className="grid  max-lg:grid-cols-1! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4 max-[600px]:gap-x-0 gap-y-21.25">
               <div className="flex gap-y-21.25 lg:flex-col max-[600px]:flex-col! lg:gap-x-0 gap-x-4">
                  {products.slice(8, 10).map((item, i) => (
                     <ProductCard key={i} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
               <Image src={"/Dummy/PersonImage.png"} width={800} height={1000} alt="Center Person Image" className=" col-span-2 w-full 2xl:h-[93.4%] xl:h-[91%] lg:h-[90%]" />
               <div className="flex gap-y-21.25 lg:flex-col max-[600px]:flex-col! lg:gap-x-0 gap-x-4">
                  {products.slice(10, 12).map((item, i) => (
                     <ProductCard key={i} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {products.slice(12, 20).map((item, i) => (
                     <ProductCard key={i} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>
         </div>
         <AddCartModal openModal={openModal} selectedProduct={selectedProduct} setOpenModal={setOpenModal} />
      </MainLayout>
   );
};

export default CollectionPage;
