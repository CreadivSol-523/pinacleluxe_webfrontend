"use client";
import MainLayout from "@/layout/MainLayout";
import SingleProductSection from "@/ui/User/Product/SingleProductSection/SingleProductSection";
import ThreeTabsSection from "@/ui/User/Product/ThreeTabsSection/ThreeTabsSection";
import IntrestedInSection from "@/ui/User/Product/IntrestedInSection/IntrestedInSection";
import { useParams } from "next/navigation";
import { useGetProductHandler, useGetSingleProductHandler } from "@/modals/ProductModal";
import { useState } from "react";
import { Product } from "@/Types/Collection/CollectionTypes";

const ProductPage = () => {
   const [currentPage, setCurrentPage] = useState(1);

   const { id } = useParams();

   // ---------- Handle API -------------
   // Get single product from API
   const { data, error, isError, isLoading } = useGetSingleProductHandler({ id: (id as string) ?? "" });

   const { data: AllProduct, isLoading: AllProductLoading } = useGetProductHandler({ limit: 4, page: currentPage, category: (data?.product?.categories?.[0] as unknown as { slug: string })?.slug ?? "" });

   const products = (AllProduct as unknown as { products: Product[] })?.products ?? [];
   const totalProducts = AllProduct?.pagination.total ?? 0;
   const totalPages = Math.ceil(totalProducts / (AllProduct?.pagination.limit ?? 4));

   return (
      <MainLayout>
         <div className="flex flex-col md:gap-17.5 gap-10.5  md:py-17.5 pb-10.5">
            <SingleProductSection data={data?.product} id={id} />
            <ThreeTabsSection />
            <IntrestedInSection data={products} totalProducts={totalProducts} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <div className="w-full h-px bg-gray-300 lg:px-10 px-5" />
            <IntrestedInSection data={products} totalProducts={totalProducts} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
         </div>
      </MainLayout>
   );
};

export default ProductPage;
