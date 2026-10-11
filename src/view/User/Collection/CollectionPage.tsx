"use client";

import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import MainLayout from "@/layout/MainLayout";
import HeadingSection from "@/ui/User/Category/HeadingSection/HeadingSection";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/Types/Collection/CollectionTypes";
import AddCartModal from "@/components/Modal/AddCartModal";
import TabsSection from "@/ui/User/Category/TabsSection/TabsSection";
import { useGetProductFilterHandler, useGetProductHandler } from "@/modals/ProductModal";
import { useParams, useRouter } from "next/navigation";
import MessageModal from "@/components/MessageModal/MessageModal";
import ProductCardSkeleton from "@/components/Skeleton/Productcardskeleton/Productcardskeleton";

const CollectionPage = () => {
   const [page, setPage] = useState(1);
   const [productFilters, setProductFilters] = useState<{ badge: string; category: string; material: string; color: string }>({
      badge: "",
      category: "",
      material: "",
      color: "",
   });
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [isFilter, setIsFilter] = useState(false);

   const pageLimit = 20;

   const { id } = useParams();

   // Get Product API
   const { data, isLoading } = useGetProductHandler({ limit: pageLimit, page: page, badge: productFilters.badge, material: productFilters.material, color: productFilters.color, category: (id as string) === "shop" ? "" : (id as string) });

   // Get Product Filter API
   const { productFilterdata } = useGetProductFilterHandler((id as string) === "shop" ? "" : (id as string));

   const products = data?.products ?? [];

   const uniqueBadges = ["All", ...(productFilterdata?.filters.badges ?? [])];

   return (
      <MainLayout isFilter={isFilter} setIsFilter={setIsFilter}>
         <div className="flex flex-col relative lg:px-10 px-5 pt-17.5 md:gap-16 gap-2 pb-21.25 ">
            <HeadingSection />
            <TabsSection isFilter={isFilter} setIsFilter={setIsFilter} filters={{ badges: uniqueBadges, colors: productFilterdata?.filters.colors || [], materials: productFilterdata?.filters.materials || [] }} productFilters={productFilters} applyFilter={setProductFilters} />

            {/* // If there is no Products */}
            {products.length === 0 && !isLoading && (
               <MessageModal title="No Matching Products" message="No products match your selected filters. Refine your search or explore our full collection." actionLabel="Clear Filters" onAction={() => setProductFilters({ badge: "", category: "", color: "", material: "" })} />
            )}

            {/* If API is loading */}
            {products.length === 0 && isLoading && (
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2   gap-x-4  gap-y-21.25">
                  {Array(8)
                     .fill(0)
                     .map((_, i) => (
                        <ProductCardSkeleton key={i} />
                     ))}
               </div>
            )}
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2   gap-x-4  gap-y-21.25">
                  {products.slice(0, 8).map((item, i) => (
                     <ProductCard key={item._id} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>

            <section className="grid  max-lg:grid-cols-1! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4 max-[600px]:gap-x-0 gap-y-21.25">
               <div className="flex gap-y-21.25 lg:flex-col max-[600px]:flex-col! lg:gap-x-0 gap-x-4">
                  {products.slice(8, 10).map((item, i) => (
                     <ProductCard key={item._id} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
               {products.length > 8 && <Image src={"/Dummy/PersonImage.png"} width={800} height={1000} alt="Center Person Image" className=" col-span-2 w-full 2xl:h-[94.7%] xl:h-[91%] lg:h-[90%]" />}
               <div className="flex gap-y-21.25 lg:flex-col max-[600px]:flex-col! lg:gap-x-0 gap-x-4">
                  {products.slice(10, 12).map((item, i) => (
                     <ProductCard key={item._id} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>
            <section>
               <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  gap-y-21.25">
                  {products.slice(12, 20).map((item, i) => (
                     <ProductCard key={item._id} data={item} AddCartDetail={(i) => setSelectedProduct(i)} isCart={(value) => setOpenModal(value)} />
                  ))}
               </div>
            </section>
         </div>
         <AddCartModal openModal={openModal} selectedProduct={selectedProduct} setOpenModal={setOpenModal} />
      </MainLayout>
   );
};

export default CollectionPage;
