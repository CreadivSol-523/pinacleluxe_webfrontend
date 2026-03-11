"use client";

import { useCartStore } from "@/Storage/UseCartStore";
import { useEffect } from "react";

// Yeh component layout mein ek baar render hoga
// aur dono stores ko localStorage se hydrate karega
export function StoreHydration() {
   useEffect(() => {
      useCartStore.persist.rehydrate();
   }, []);

   return null; // kuch render nahi karta
}
