import Image from "next/image";
import React from "react";

const ReferCards = ({ img, heading, text }: { img: string; heading: string; text: string }) => {
   return (
      <div className="relative xl:w-[calc((100vw-10em)/3)] lg:w-[calc((100vw-8em)/3)] max-[700px]:w-[calc((100vw-40px))] w-[calc((100vw-5em)/2)] 2xl:h-170 xl:h-125 lg:h-[28em] max-lg:h-135 max-[850px]:h-120! max-[700px]:h-150! max-[450px]:h-120! ">
         <div className="w-full" style={{ paddingTop: "125%" }}>
            <div className="w-full h-full absolute bg-black/15 top-0 z-40" />
            <Image src={img || "/Dummy/Home/Refer1.png"} alt="Category Image Here" fill className="object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 gap-2 bottom-5 z-50">
               <h2 className="text-white fontInterRegular 2xl:text-3xl! xl:text-[26px]! max-xl:text-[24px]! max-sm:text-md!" style={{ fontWeight: 400 }}>
                  {heading || "Refer And Earn"}
               </h2>
               <p className="text-white text-center">{text || "Be part of our inner circle and invite friends to unlock rewards made for those who share refined taste."}</p>
            </div>
         </div>
      </div>
   );
};

export default ReferCards;
