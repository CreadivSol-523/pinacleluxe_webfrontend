import Button from "@/components/Button/Button";
import React from "react";

const SaleBanner = () => {
   return (
      <section className="lg:px-10 px-5 h-[calc(70vh-7.125rem)] xl:h-[calc(50vh-7.125rem)] bg-staticSecondaryBG flex min-[500px]:items-center items-start min-[500px]:gap-0 gap-6 min-[500px]:justify-between justify-center min-[500px]:flex-row flex-col">
         <span className="flex xl:items-center items-start xl:flex-row flex-col xl:gap-16 gap-6">
            <h1 className="uppercase">New Year Sale</h1>
            <h3>Our Sale is now Live. Shop Upto 60% Off</h3>
         </span>
         <Button name="Shop All" />
      </section>
   );
};

export default SaleBanner;
