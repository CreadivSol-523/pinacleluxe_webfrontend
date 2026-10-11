import Image from "next/image";
import React from "react";

const ImageSection = () => {
   return (
      <section className="flex lg:flex-row flex-col items-center lg:justify-between gap-10 lg:gap-8 xl:gap-12 lg:px-10 px-5">
         <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[420px] xl:h-[520px] 2xl:h-[800px]">
               <Image src={"/Dummy/Product/ProductImg.png"} fill sizes="(max-width: 1024px) 100vw, 50vw" alt="About us section image" className="object-cover" priority />
            </div>
         </div>

         <div className="flex flex-col gap-3 sm:gap-4 lg:gap-4.5 w-full lg:w-1/2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl uppercase">Beauty and Function</h2>
            <p className="text-sm sm:text-base lg:text-[15px] xl:text-base leading-relaxed sm:leading-loose text-justify sm:text-left">
               As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to
               improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we
               may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this
               Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time
               to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such
               changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert
               you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.
            </p>
         </div>
      </section>
   );
};

export default ImageSection;
