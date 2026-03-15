import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FavoriteItem, FavoriteStore } from "./StorageTypes";

export const useFavoriteStore = create<FavoriteStore>()(
   persist(
      (set, get) => ({
         favorites: [],

         toggleFavorite: (item: FavoriteItem) => {
            const { favorites } = get();
            const exists = favorites.find((fav) => fav.id === item.id && fav.color.hex === item.color.hex && fav.material === item.material);

            if (exists) {
               set({
                  favorites: favorites.filter((fav) => !(fav.id === item.id && fav.color.hex === item.color.hex && fav.material === item.material)),
               });
            } else {
               set({ favorites: [...favorites, item] });
            }
         },

         removeFromFavorites: (id: string, color: { hex: string; image: string }, material: string) => {
            set({
               favorites: get().favorites.filter((fav) => !(fav.id === id && fav.color === color && fav.material === material)),
            });
         },

         clearFavorites: () => set({ favorites: [] }),

         isFavorite: (id: string, color: { hex: string; image: string }, material: string) => get().favorites.some((fav) => fav.id === id && fav.color === color && fav.material === material),

         getFavoriteCount: () => get().favorites.length,
      }),
      {
         name: "favorites-storage",
         storage: createJSONStorage(() => localStorage),
         skipHydration: true,
      },
   ),
);
