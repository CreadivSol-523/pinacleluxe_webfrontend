"use client";

import { useCartStore } from "@/Storage/UseCartStore";
import { useFavoriteStore } from "@/Storage/UseFavoriteStore";
import { useEffect } from "react";

// Yeh component layout mein ek baar render hoga
// aur dono stores ko localStorage se hydrate karega
export function StoreHydration() {
   useEffect(() => {
      useCartStore.persist.rehydrate();
      useFavoriteStore.persist.rehydrate();
   }, []);

   return null; // kuch render nahi karta
}
