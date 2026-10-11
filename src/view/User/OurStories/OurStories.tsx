// "use client";
// import MainLayout from "@/layout/MainLayout";
// import { getWebSections } from "@/modals/WebSectionsModal";
// import { StoriesData } from "@/Types/WebSection/WebSection";
// import BannerSection from "@/ui/User/Home/BannerSection/BannerSection";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";

// const OurStories = ({ storiesData }: { storiesData: StoriesData }) => {
//    const wrapperRef = useRef<HTMLDivElement>(null);
//    const sectionRef = useRef<HTMLElement>(null);
//    const textRef = useRef<HTMLDivElement>(null);
//    const [translateY, setTranslateY] = useState(0);
//    console.log(storiesData);
//    useEffect(() => {
//       const wrapper = wrapperRef.current;
//       const section = sectionRef.current;
//       const text = textRef.current;
//       if (!wrapper || !section || !text) return;

//       const handleScroll = () => {
//          const sectionRect = section.getBoundingClientRect();
//          const windowHeight = window.innerHeight;
//          const textHeight = text.offsetHeight;

//          const triggerPoint = windowHeight * (window.innerWidth < 1024 ? 0.35 : 0.3);

//          if (sectionRect.top > triggerPoint) {
//             setTranslateY(0);
//             return;
//          }

//          const scrolledIn = triggerPoint - sectionRect.top;

//          const maxMove = windowHeight / 2 - textHeight / 2 - 40;
//          const clamped = Math.min(scrolledIn, maxMove);
//          setTranslateY(clamped);
//       };

//       window.addEventListener("scroll", handleScroll, { passive: true });
//       handleScroll();

//       return () => window.removeEventListener("scroll", handleScroll);
//    }, []);

//    return (
//       <MainLayout>
//          {/* <BannerSection /> */}
//          <section className="w-full">
//             <picture>
//                <source media="(max-width: 767px)" srcSet={"/Dummy/Home/Banner.png"} />

//                <Image src={"/Dummy/Home/Banner.png"} width={1920} height={800} alt="Banner" priority className="w-full h-auto object-contain" />
//             </picture>
//          </section>
//          <div ref={wrapperRef}>
//             <section ref={sectionRef} id="story-section" className="relative top-0 h-screen overflow-hidden flex items-start justify-items-start">
//                <Image src={"/Dummy/OurStory.png"} width={1920} height={1080} alt="Our Story Image" className="h-screen w-screen" />
//                <div
//                   ref={textRef}
//                   className=" text-center absolute left-1/2 max-2xl:w-[70%] max-sm:w-full 2xl:-translate-x-full xl:translate-x-[-70%] sm:translate-x-[-70%] translate-x-[-55%] pl-10"
//                   style={{
//                      top: "50%",
//                      transform: ` translateY(calc(-50% + ${translateY}px))`,
//                   }}
//                >
//                   <h1 className="font-bold mb-6 text-start text-white">Being a modern brand, in tune with the times.</h1>
//                   <p className="text-white text-start">
//                      Founded in the heart of Paris over 30 years ago, LANCASTER has become a key player in French leather goods, rooted in both tradition and modernity. Proud of our success, we are also aware of the responsibility it entails. Because today, fashion cannot turn a blind eye to its
//                      impact on the planet and people.
//                   </p>
//                </div>
//             </section>
//          </div>
//       </MainLayout>
//    );
// };

// export default OurStories;

import MainLayout from "@/layout/MainLayout";
import { StoriesData } from "@/Types/WebSection/WebSection";
import StoriesAnimation from "@/ui/User/OurStories/StoriesAnimation";
import Image from "next/image";

const OurStories = ({ storiesData }: { storiesData: StoriesData }) => {
   const BannerdesktopImage = typeof storiesData.bannerImageWeb === "string" ? storiesData.bannerImageWeb : "/Dummy/Home/Banner.png";
   const BannermobileImage = typeof storiesData.bannerImageMobile === "string" ? storiesData.bannerImageMobile : BannerdesktopImage;

   const SectiondesktopImage = typeof storiesData.sectionImageWeb === "string" ? storiesData.sectionImageWeb : "/Dummy/Home/Banner.png";
   const SectionmobileImage = typeof storiesData.sectionImageMobile === "string" ? storiesData.sectionImageMobile : SectiondesktopImage;

   return (
      <MainLayout>
         {/* Banner */}
         <section className="w-full">
            <picture>
               <source media="(max-width: 767px)" srcSet={BannermobileImage} />

               <Image src={BannerdesktopImage} width={1920} height={800} alt="Lancaster Our Stories" priority unoptimized className="w-full h-auto object-contain" />
            </picture>
         </section>

         {/* Story Section */}
         <section id="story-section" className="relative w-full h-screen overflow-hidden">
            <picture>
               <source media="(max-width: 767px)" srcSet={SectionmobileImage} />

               <Image src={SectiondesktopImage} width={1920} height={1080} alt="Lancaster story" priority={false} className="absolute inset-0 w-full h-full object-cover" />
            </picture>

            <StoriesAnimation>
               <h1 className="font-bold mb-6 text-start text-white">{storiesData.title}</h1>

               <p className="text-white text-start">{storiesData.subtitle}</p>
            </StoriesAnimation>
         </section>
      </MainLayout>
   );
};

export default OurStories;
