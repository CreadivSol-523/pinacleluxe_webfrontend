import ReferCards from "@/components/Cards/ReferCards/ReferCards";
import React from "react";

const ReferSection = () => {
   const cardData = [
      {
         img: "/Dummy/Home/Refer1.png",
         heading: "Refer And Earn",
         text: "Be part of our inner circle and invite friends to unlock rewards made for those who share refined taste.",
      },
      {
         img: "/Dummy/Home/Refer2.png",
         heading: "Exclusive Discounts",
         text: "Created for those who value quality, enjoy limited offers on thoughtfully crafted pieces.",
      },
      {
         img: "/Dummy/Home/Refer3.png",
         heading: "Built to Last",
         text: "Defined by quality and detail, each bag features premium materials, precise stitching, and timeless design.",
      },
   ];
   return (
      <section className="lg:px-10 px-5">
         <div className="grid xl:place-items-center max-[700px]:place-items-center max-[600px]:grid-cols-1! max-[700px]:grid-cols-1! lg:grid-cols-3  grid-cols-2 xl:gap-10 gap-6">
            {cardData.map((item, i) => (
               <ReferCards heading={item?.heading} img={item.img} text={item.text} key={i} />
            ))}
         </div>
      </section>
   );
};

export default ReferSection;
