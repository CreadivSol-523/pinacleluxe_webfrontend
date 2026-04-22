import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FavoriteItem, FavoriteStore } from "../Types/StorageTypes";

export const useFavoriteStore = create<FavoriteStore>()(
   persist(
      (set, get) => ({
         favorites: [],

         toggleFavorite: (item: FavoriteItem) => {
            const { favorites } = get();
            const exists = favorites.find((fav) => fav.id === item.id && fav.colorVariants === item.colorVariants && fav.material === item.material);

            if (exists) {
               set({
                  favorites: favorites.filter((fav) => !(fav.id === item.id && fav.colorVariants === item.colorVariants && fav.material === item.material)),
               });
            } else {
               set({ favorites: [...favorites, item] });
            }
         },

         removeFromFavorites: (id: string, colorVariants: string, material: string) => {
            set({
               favorites: get().favorites.filter((fav) => !(fav.id === id && fav.colorVariants === colorVariants && fav.material === material)),
            });
         },

         clearFavorites: () => set({ favorites: [] }),

         isFavorite: (id: string, colorVariants: string, material: string) => get().favorites.some((fav) => fav.id === id && fav.colorVariants === colorVariants && fav.material === material),

         getFavoriteCount: () => get().favorites.length,
      }),
      {
         name: "favorites-storage",
         storage: createJSONStorage(() => localStorage),
         skipHydration: true,
      },
   ),
);
