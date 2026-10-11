"use client";

import { useEffect, useRef, useState } from "react";
import { useLoaderStore } from "./useLoaderStore";
import PageLoader from "@/app/loading";

const EXIT_DURATION = 500;
const MIN_VISIBLE_DURATION = 1400; // ms — guarantees the entrance animation is fully seen

export default function LoaderOverlay() {
   const isLoading = useLoaderStore((s) => s.isLoading);
   const [mounted, setMounted] = useState(isLoading);
   const [exiting, setExiting] = useState(false);
   const shownAtRef = useRef<number | null>(null);

   useEffect(() => {
      if (isLoading) {
         shownAtRef.current = Date.now();
         setMounted(true);
         setExiting(false);
         return;
      }

      if (mounted) {
         const elapsed = Date.now() - (shownAtRef.current ?? Date.now());
         const remaining = Math.max(MIN_VISIBLE_DURATION - elapsed, 0);

         const startExit = setTimeout(() => {
            setExiting(true);

            const timeout = setTimeout(() => {
               setMounted(false);
               setExiting(false);
            }, EXIT_DURATION);

            return () => clearTimeout(timeout);
         }, remaining);

         return () => clearTimeout(startExit);
      }
   }, [isLoading, mounted]);

   if (!mounted) return null;

   return (
      <div className={exiting ? "pl-exit" : ""}>
         <PageLoader />
         <style jsx>{`
            .pl-exit {
               animation: pl-curtain-up ${EXIT_DURATION}ms ease-in forwards;
            }

            @keyframes pl-curtain-up {
               to {
                  opacity: 0;
                  transform: translateY(-16px);
               }
            }

            @media (prefers-reduced-motion: reduce) {
               .pl-exit {
                  animation: none;
                  opacity: 0;
               }
            }
         `}</style>
      </div>
   );
}
