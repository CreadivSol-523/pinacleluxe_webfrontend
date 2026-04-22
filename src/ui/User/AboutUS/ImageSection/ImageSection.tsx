import Image from "next/image";
import React from "react";

const ImageSection = () => {
   return (
      <section className="flex items-center lg:justify-between lg:flex-row flex-col max-lg:gap-17.5 lg:px-10 px-5">
         <div className="lg:w-2/4 flex items-center justify-start">
            <Image src={"/Dummy/Product/ProductImg.png"} width={800} height={1000} alt="About us section image" className="2xl:h-250 xl:h-180 max-lg:h-auto" />
         </div>
         <div className="flex flex-col gap-4.5 lg:w-2/4">
            <h2>Beauty and Function</h2>
            <h4>
               As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to
               improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we
               may need to change this Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this
               Privacy Policy from time to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time
               to time. Upon such changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such
               changes, we will alert you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.As we continually work to improve our Services, we may need to change this Privacy Policy from time to time. Upon such changes, we will alert
               you to any such changes by placing a notice on the Cuyana website, by sending you an email and/or by some other means.
            </h4>
         </div>
      </section>
   );
};

export default ImageSection;
