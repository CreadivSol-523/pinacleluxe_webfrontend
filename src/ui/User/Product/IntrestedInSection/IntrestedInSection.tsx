import React from "react";
import { products } from "../../../../DummyData/Products.json";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductCard from "@/components/Cards/ProductCard/ProductCard";

const IntrestedInSection = () => {
   return (
      <section className="lg:px-10 px-5 flex flex-col md:gap-17.5 gap-10.5 items-center">
         <h2 className="uppercase">you may be intrested in</h2>
         <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 lg:gap-x-2 gap-x-4  md:gap-y-21.25 gap-y-10.25">
            {products.slice(0, 4).map((item, i) => (
               <ProductCard key={i} data={item} />
            ))}
         </div>
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink>1</PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink isActive>2</PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink>3</PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationEllipsis />
               </PaginationItem>
               <PaginationItem>
                  <PaginationNext />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </section>
   );
};

export default IntrestedInSection;
