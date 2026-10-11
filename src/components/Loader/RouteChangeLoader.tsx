"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoaderStore } from "./useLoaderStore";

export default function RouteChangeLoader() {
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const { show, hide } = useLoaderStore();
   const isFirstRender = useRef(true);

   // Hide once the new route has actually resolved.
   useEffect(() => {
      if (isFirstRender.current) {
         isFirstRender.current = false;
         return;
      }
      hide();
   }, [pathname, hide, searchParams]);

   // Intercept clicks on internal links to start the loader immediately,
   // before Next.js begins fetching the next route.
   useEffect(() => {
      function handleClick(e: MouseEvent) {
         if (e.defaultPrevented) return;

         const anchor = (e.target as HTMLElement)?.closest("a");
         if (!anchor) return;

         const href = anchor.getAttribute("href");
         if (!href || href.startsWith("#") || anchor.target === "_blank") return;

         const isInternal = href.startsWith("/") || href.startsWith(window.location.origin);
         const isSameRoute = href === pathname;
         const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

         if (isInternal && !isSameRoute && !isModifiedClick) {
            show();
            setTimeout(() => hide(), 5000);
         }
      }

      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
   }, [pathname, show]);

   return null;
}
