import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartStore, Product } from "./StorageTypes";

export const useCartStore = create<CartStore>()(
   persist(
      (set, get) => ({
         items: [],

         addToCart: (product: Product, quantity: number = 1) => {
            const { items } = get();
            const existing = items.find((item) => item.id === product.id && item.color === product.color && item.material === product.material);

            if (existing) {
               const newQuantity = existing.quantity + quantity;
               if (newQuantity > product.stock) return; // stock exceed na ho
               set({
                  items: items.map((item) => (item.id === product.id && item.color === product.color && item.material === product.material ? { ...item, quantity: newQuantity } : item)),
               });
            } else {
               const safeQuantity = Math.min(quantity, product.stock); // stock se zyada nahi
               set({ items: [...items, { ...product, quantity: safeQuantity }] });
            }
         },

         removeFromCart: (productId: string, color: string, material: string) => {
            set({
               items: get().items.filter((item) => !(item.id === productId && item.color === color && item.material === material)),
            });
         },

         updateQuantity: (productId: string, quantity: number) => {
            if (quantity < 1) {
               set({ items: get().items.filter((item) => item.id !== productId) });
               return;
            }
            set({
               items: get().items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
            });
         },

         clearCart: () => set({ items: [] }),

         getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

         getSubtotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),

         isInCart: (productId: string) => get().items.some((item) => item.id === productId),

         getCartItem: (productId: string) => get().items.find((item) => item.id === productId),

         getQuantity: (productId: string) => {
            const item = get().items.find((item) => item.id === productId);
            return item ? item.quantity : 0;
         },
      }),
      {
         name: "cart-storage",
         storage: createJSONStorage(() => localStorage),
         skipHydration: true,
      },
   ),
);
