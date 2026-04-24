import CategoryCards from "@/components/Cards/CategoryCards/CategoryCards";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import React from "react";

const CategorySection = () => {
   const cardData = [
      {
         img: "/Dummy/Home/CategoryImg.png",
         heading: "Totes",
      },
      {
         img: "/Dummy/Home/CategoryImg2.png",
         heading: "Jewelry",
      },
      {
         img: "/Dummy/Home/CategoryImg3.png",
         heading: "Shoulder Bags",
      },
      {
         img: "/Dummy/Home/CategoryImg4.png",
         heading: "Small Leather Goods",
      },
   ];
   return (
      <section className="lg:px-10 px-5">
         <div className="grid max-[600px]:grid-cols-1! max-[850px]:grid-cols-2! md:grid-cols-3 lg:grid-cols-4 gap-2!">
            {cardData.map((item, i) => (
               <CategoryCards heading={item?.heading} img={item?.img} key={i} />
            ))}
         </div>
      </section>
   );
};

export default CategorySection;
