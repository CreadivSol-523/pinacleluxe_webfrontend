import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import { Product } from "@/Types/Collection/CollectionTypes";
import { getPageNumbers } from "@/helper/GetPagesNumber";

interface IntrestedInSectionProps {
   data: Product[];
   totalProducts?: number;
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

const IntrestedInSection = ({ data, currentPage, totalPages, onPageChange }: IntrestedInSectionProps) => {
   const handlePrevious = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
   };

   const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
   };

   return (
      <section className="lg:px-10 px-5 flex flex-col md:gap-17.5 gap-10.5 items-center">
         <h2 className="uppercase">you may be intrested in</h2>
         <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  md:gap-y-21.25 gap-y-10.25">
            {data?.map((item, i) => (
               <ProductCard key={i} data={item} />
            ))}
         </div>

         {totalPages > 1 && (
            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious onClick={handlePrevious} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                  </PaginationItem>

                  {getPageNumbers({ currentPage, totalPages }).map((page, i) =>
                     page === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                           <PaginationEllipsis />
                        </PaginationItem>
                     ) : (
                        <PaginationItem key={page}>
                           <PaginationLink isActive={page === currentPage} onClick={() => onPageChange(page)} className="cursor-pointer">
                              {page}
                           </PaginationLink>
                        </PaginationItem>
                     ),
                  )}

                  <PaginationItem>
                     <PaginationNext onClick={handleNext} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         )}
      </section>
   );
};

export default IntrestedInSection;
