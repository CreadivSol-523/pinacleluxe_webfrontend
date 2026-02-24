import Image from "next/image";

const BannerSection = () => {
   return (
      <section>
         <Image src={"/Dummy/Home/Banner.png"} width={1920} height={1080} alt="Banner Image Here" className="w-screen h-screen object-cover" />
      </section>
   );
};

export default BannerSection;
