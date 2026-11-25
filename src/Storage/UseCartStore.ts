import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartStore, Product } from "../Types/StorageTypes";

// Ek unique key: undefined / "" dono same treat honge, isliye match miss nahi hoga
const makeKey = (
   id: string,
   color?: string | null,
   material?: string | null,
   currency?: string | null
) => `${id}|${color ?? ""}|${material ?? ""}|${currency ?? ""}`;

const getItemKey = (item: {
   id: string;
   colorVariants?: string | null;
   material?: string | null;
   currency?: string | null;
}) => makeKey(item.id, item.colorVariants, item.material, item.currency);

export const useCartStore = create<CartStore>()(
   persist(
      (set, get) => ({
         items: [],
         isCartOpen: false,

         setCartOpen: (open: boolean) => set({ isCartOpen: open }),

         toggleCart: () =>
            set((state) => ({
               isCartOpen: !state.isCartOpen,
            })),

         addToCart: (product: Product, quantity: number = 1): { success: boolean; message?: string } => {
            const stockAvailable = product?.stock ?? 0;

            if (stockAvailable <= 0) {
               return { success: false, message: "Sorry, this product is currently out of stock." };
            }

            const { items } = get();
            const key = getItemKey(product);
            const existing = items.find((item) => getItemKey(item) === key);

            if (existing) {
               const newQuantity = existing.quantity + quantity;

               if (newQuantity > stockAvailable) {
                  return { success: false, message: `Only ${stockAvailable} item(s) available in stock.` };
               }

               set({
                  items: items.map((item) =>
                     getItemKey(item) === key
                        ? { ...item, quantity: newQuantity, stock: stockAvailable, regionId: product.regionId ?? item.regionId } // stock fresh + regionId save/backfill
                        : item
                  ),
               });

               return { success: true };
            }

            const safeQuantity = Math.min(quantity, stockAvailable);

            if (safeQuantity <= 0) {
               return { success: false, message: "Sorry, this product is currently out of stock." };
            }

            set({ items: [...items, { ...product, quantity: safeQuantity, regionId: product.regionId }] });

            return { success: true };
         },

         removeFromCart: (productId: string, color: string, material: string, currency: string) => {
            const key = makeKey(productId, color, material, currency);
            set({ items: get().items.filter((item) => getItemKey(item) !== key) });
         },

         updateQuantity: (productId: string, quantity: number, color?: string, material?: string, currency?: string) => {
            const key = makeKey(productId, color, material, currency);

            if (quantity < 1) {
               set({ items: get().items.filter((item) => getItemKey(item) !== key) });
               return;
            }

            set({
               items: get().items.map((item) => {
                  if (getItemKey(item) !== key) return item;

                  const max = item.stock ?? Infinity;
                  return { ...item, quantity: Math.min(quantity, max) };
               }),
            });
         },

         clearCart: () => set({ items: [] }),

         getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

         getSubtotal: () => get().items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),

         isInCart: (productId: string, color: string, material: string, currency: string) => {
            const key = makeKey(productId, color, material, currency);
            return get().items.some((item) => getItemKey(item) === key);
         },

         getCartItem: (productId: string, color?: string, material?: string, currency?: string) => {
            const key = makeKey(productId, color, material, currency);
            return get().items.find((item) => getItemKey(item) === key);
         },

         getQuantity: (productId: string, color?: string, material?: string, currency?: string) => {
            const key = makeKey(productId, color, material, currency);
            const item = get().items.find((i) => getItemKey(i) === key);
            return item ? item.quantity : 0;
         },
      }),
      {
         name: "cart-storage",
         storage: createJSONStorage(() => localStorage),
         skipHydration: true,
      }
   )
);