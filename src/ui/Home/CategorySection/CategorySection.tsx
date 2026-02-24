import CategoryCards from "@/components/CategoryCards/CategoryCards";
import React from "react";

const CategorySection = () => {
   return (
      <section className="lg:px-10 px-5">
         <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 gap-2">
            <CategoryCards />
            <CategoryCards />
            <CategoryCards />
            <CategoryCards />
         </div>
      </section>
   );
};

export default CategorySection;
