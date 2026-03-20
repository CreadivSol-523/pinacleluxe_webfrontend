"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
   { img: "/Dummy/Home/Celeb1.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/Celeb2.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/Celeb3.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/Celeb4.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/Celeb5.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/Celeb6.png", username: "@SelenaGomez" },
   { img: "/Dummy/Home/CategoryImg.png", username: "@SelenaGomez" },
];

const VISIBLE_SIDES = 3;
const SLIDE_WIDTH = 300;
const FIXED_GAP = 16;
const TOTAL = slides.length;
const SCALE_STEP = 0.1;

const mod = (n: number, m: number) => ((n % m) + m) % m;

function getXForOffset(offset: number): number {
   if (offset === 0) return 0;
   const sign = offset > 0 ? 1 : -1;
   const abs = Math.abs(offset);
   let x = 0;
   for (let i = 1; i <= abs; i++) {
      const prevScale = 1 - (i - 1) * SCALE_STEP;
      const curScale = 1 - i * SCALE_STEP;
      x += (SLIDE_WIDTH * prevScale) / 2 + FIXED_GAP + (SLIDE_WIDTH * curScale) / 2;
   }
   return sign * x;
}

export default function CarouselSection() {
   const [activeIndex, setActiveIndex] = useState(0);

   // Use refs for drag state — no re-renders during drag
   const dragStartX = useRef<number | null>(null);
   const dragMoved = useRef(false);
   const activeIndexRef = useRef(activeIndex);
   activeIndexRef.current = activeIndex;

   const prev = useCallback(() => setActiveIndex((i) => mod(i - 1, TOTAL)), []);
   const next = useCallback(() => setActiveIndex((i) => mod(i + 1, TOTAL)), []);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === "ArrowLeft") prev();
         if (e.key === "ArrowRight") next();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [prev, next]);

   // Attach mouse/touch events on window so overflow-hidden doesn't cut them off
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const handleStart = (clientX: number) => {
         dragStartX.current = clientX;
         dragMoved.current = false;
      };

      const handleMove = (clientX: number) => {
         if (dragStartX.current === null) return;
         if (Math.abs(clientX - dragStartX.current) > 8) {
            dragMoved.current = true;
         }
      };

      const handleEnd = (clientX: number) => {
         if (dragStartX.current === null) return;
         const delta = clientX - dragStartX.current;
         if (dragMoved.current) {
            if (delta < -50) next();
            else if (delta > 50) prev();
         }
         dragStartX.current = null;
         dragMoved.current = false;
      };

      // Mouse events
      const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const onMouseUp = (e: MouseEvent) => handleEnd(e.clientX);

      // Touch events
      const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
      const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const onTouchEnd = (e: TouchEvent) => handleEnd(e.changedTouches[0].clientX);

      el.addEventListener("mousedown", onMouseDown);
      // Move and up on WINDOW so overflow-hidden doesn't block them
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);

      return () => {
         el.removeEventListener("mousedown", onMouseDown);
         window.removeEventListener("mousemove", onMouseMove);
         window.removeEventListener("mouseup", onMouseUp);
         el.removeEventListener("touchstart", onTouchStart);
         window.removeEventListener("touchmove", onTouchMove);
         window.removeEventListener("touchend", onTouchEnd);
      };
   }, [next, prev]);

   const getOffset = (index: number) => {
      let offset = index - activeIndex;
      if (offset > TOTAL / 2) offset -= TOTAL;
      if (offset < -TOTAL / 2) offset += TOTAL;
      return offset;
   };

   const getSlideStyle = (index: number): React.CSSProperties => {
      const offset = getOffset(index);
      const absOffset = Math.abs(offset);
      if (absOffset > VISIBLE_SIDES) return { display: "none" };

      const scale = 1 - absOffset * SCALE_STEP;
      const x = getXForOffset(offset);
      const y = absOffset * 30;
      const height = 420 - absOffset * 38;
      const zIndex = VISIBLE_SIDES - absOffset + 1;

      return {
         position: "absolute",
         width: `${SLIDE_WIDTH}px`,
         height: `${height}px`,
         transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
         transformOrigin: "top center",
         zIndex,
         transition: "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
         cursor: "grab",
         userSelect: "none",
      };
   };

   return (
      <div className="w-full flex flex-col justify-center items-center gap-10 bg-white overflow-hidden select-none relative mt-10!">
         <div className="flex items-center justify-center flex-col">
            <h2 className="text-center">World of Inspiration</h2>
            <p className="text-center">Loved by famous faces, carried with confidence.</p>
         </div>
         <div ref={containerRef} className="relative flex items-start justify-center 2xl:w-full! xl:w-[93.5%]! w-[91%]! overflow-hidden" style={{ height: "500px", cursor: "grab" }}>
            {slides.map((slide, index) => {
               const offset = getOffset(index);
               return (
                  <div
                     key={index}
                     style={getSlideStyle(index)}
                     onClick={() => {
                        if (!dragMoved.current) {
                           if (offset > 0) next();
                           else if (offset < 0) prev();
                        }
                     }}
                  >
                     <div className="w-full h-full overflow-hidden">
                        <img src={slide.img} alt={slide.username} className="w-full h-full object-cover" draggable={false} />
                     </div>
                     <p className="text-center mt-2!">{slide.username}</p>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
