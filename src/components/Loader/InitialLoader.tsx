"use client";

import { useEffect } from "react";
import { useLoaderStore } from "./useLoaderStore";

export default function InitialLoader() {
   const show = useLoaderStore((state) => state.show);
   const hide = useLoaderStore((state) => state.hide);

   useEffect(() => {
      show();

      const timer = setTimeout(() => {
         hide();
      }, 1200);

      return () => clearTimeout(timer);
   }, [show, hide]);

   return null;
}
