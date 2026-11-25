export interface Product {
   id: string;
   name: string;
   price: number;
   images: string;
   stock: number;
   colorVariants: string;
   material: string;
   currency: string;
   regionId?: string; // price entry ki region ka _id (sirf addToCart par save hota hai)
   category?: string;
   discountPrice?: number;
}

export interface CartItem extends Product {
   quantity: number;
}

// Cart Store
export interface CartStore {
   isCartOpen: boolean;

   setCartOpen: (open: boolean) => void;
   toggleCart: () => void;

   items: CartItem[];

   getCartItem: (
      productId: string,
      colorVariants?: string,
      material?: string,
      currency?: string
   ) => CartItem | undefined;

   addToCart: (
      product: Product,
      quantity?: number
   ) => { success: boolean; message?: string };

   removeFromCart: (
      productId: string,
      colorVariants: string,
      material: string,
      currency: string
   ) => void;

   updateQuantity: (
      productId: string,
      quantity: number,
      colorVariants?: string,
      material?: string,
      currency?: string
   ) => void;

   clearCart: () => void;

   getItemCount: () => number;

   getSubtotal: () => number;

   isInCart: (
      productId: string,
      colorVariants: string,
      material: string,
      currency: string
   ) => boolean;

   getQuantity: (
      productId: string,
      colorVariants?: string,
      material?: string,
      currency?: string
   ) => number;
}

// Favorite Store
export interface FavoriteItem {
   id: string;
   name: string;
   price: number;
   images: string;
   stock: number;
   colorVariants: string;
   material: string;
   category?: string;
   discountPrice?: number;
   currency: string;
}

export interface FavoriteStore {
   favorites: FavoriteItem[];
   toggleFavorite: (item: FavoriteItem) => void;
   removeFromFavorites: (id: string, colorVariants: string, material: string, currency: string) => void;
   clearFavorites: () => void;
   isFavorite: (id: string, colorVariants: string, material: string, currency: string) => boolean;
   getFavoriteCount: () => number;
}