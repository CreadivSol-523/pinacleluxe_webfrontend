export interface Product {
   id: string;
   name: string;
   price: number;
   images: string;
   stock: number;
   colorVariants: string;
   material: string;
   category?: string;
   discountPrice?: number;
}

export interface CartItem extends Product {
   quantity: number;
}

// Cart Store
export interface CartStore {
   items: CartItem[];
   getCartItem: (productId: string, colorVariants?: string, material?: string) => CartItem | undefined;
   addToCart: (product: Product, quantity?: number) => void;
   removeFromCart: (productId: string, colorVariants: string, material: string) => void;
   updateQuantity: (productId: string, quantity: number, colorVariants: string, material: string) => void;
   clearCart: () => void;
   getItemCount: () => number;
   getSubtotal: () => number;
   isInCart: (productId: string, colorVariants: string, material: string) => boolean;
   getQuantity: (productId: string) => number;
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
}

export interface FavoriteStore {
   favorites: FavoriteItem[];
   toggleFavorite: (item: FavoriteItem) => void;
   removeFromFavorites: (id: string, colorVariants: string, material: string) => void;
   clearFavorites: () => void;
   isFavorite: (id: string, colorVariants: string, material: string) => boolean;
   getFavoriteCount: () => number;
}
