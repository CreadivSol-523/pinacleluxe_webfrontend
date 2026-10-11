"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface StoriesAnimationProps {
   children: ReactNode;
}

const StoriesAnimation = ({ children }: StoriesAnimationProps) => {
   const textRef = useRef<HTMLDivElement>(null);

   const [translateY, setTranslateY] = useState(0);

   useEffect(() => {
      const text = textRef.current;

      if (!text) return;

      const handleScroll = () => {
         const section = text.closest("#story-section");

         if (!section) return;

         const sectionRect = section.getBoundingClientRect();
         const windowHeight = window.innerHeight;
         const textHeight = text.offsetHeight;

         const triggerPoint = windowHeight * (window.innerWidth < 1024 ? 0.35 : 0.3);

         if (sectionRect.top > triggerPoint) {
            setTranslateY(0);
            return;
         }

         const scrolledIn = triggerPoint - sectionRect.top;

         const maxMove = Math.max(0, windowHeight / 2 - textHeight / 2 - 40);

         const clamped = Math.min(scrolledIn, maxMove);

         setTranslateY(clamped);
      };

      window.addEventListener("scroll", handleScroll, {
         passive: true,
      });

      handleScroll();

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   return (
      <div
         ref={textRef}
         className=" absolute left-1/2 top-1/2 z-10 text-center max-2xl:w-[70%] max-sm:w-full 2xl:-translate-x-full xl:translate-x-[-70%] sm:translate-x-[-70%] translate-x-[-55%] pl-10"
         style={{
            transform: `translateY(calc(-50% + ${translateY}px))`,
         }}
      >
         {children}
      </div>
   );
};

export default StoriesAnimation;
