import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FavoriteItem, FavoriteStore } from "../Types/StorageTypes";

export const useFavoriteStore = create<FavoriteStore>()(
   persist(
      (set, get) => ({
         favorites: [],

         toggleFavorite: (item: FavoriteItem) => {
            const { favorites } = get();

            const exists = favorites.find(
               (fav) =>
                  fav.id === item.id &&
                  fav.colorVariants === item.colorVariants &&
                  fav.material === item.material &&
                  fav.currency === item.currency
            );

            if (exists) {
               set({
                  favorites: favorites.filter(
                     (fav) =>
                        !(
                           fav.id === item.id &&
                           fav.colorVariants === item.colorVariants &&
                           fav.material === item.material &&
                           fav.currency === item.currency
                        )
                  ),
               });
            } else {
               set({ favorites: [...favorites, item] });
            }
         },

         removeFromFavorites: (
            id: string,
            colorVariants: string,
            material: string,
            currency: string
         ) => {
            set({
               favorites: get().favorites.filter(
                  (fav) =>
                     !(
                        fav.id === id &&
                        fav.colorVariants === colorVariants &&
                        fav.material === material &&
                        fav.currency === currency
                     )
               ),
            });
         },

         clearFavorites: () => set({ favorites: [] }),

         isFavorite: (
            id: string,
            colorVariants: string,
            material: string,
            currency: string
         ) =>
            get().favorites.some(
               (fav) =>
                  fav.id === id &&
                  fav.colorVariants === colorVariants &&
                  fav.material === material &&
                  fav.currency === currency
            ),

         getFavoriteCount: () => get().favorites.length,
      }),
      {
         name: "favorites-storage",
         storage: createJSONStorage(() => localStorage),
         skipHydration: true,
      }
   )
);