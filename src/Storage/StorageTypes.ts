export interface Product {
   id: string;
   name: string;
   price: number;
   image: string;
   stock: number;
   color: { hex: string; image: string };
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
   getCartItem: (productId: string, color?: string, material?: string) => CartItem | undefined;
   addToCart: (product: Product, quantity?: number) => void;
   removeFromCart: (productId: string, color: string, material: string) => void;
   updateQuantity: (productId: string, quantity: number, color: string, material: string) => void;
   clearCart: () => void;
   getItemCount: () => number;
   getSubtotal: () => number;
   isInCart: (productId: string, color: string, material: string) => boolean;
   getQuantity: (productId: string) => number;
}

// Favorite Store
export interface FavoriteStore {
   favorites: Product[];
   toggleFavorite: (product: Product) => void;
   removeFromFavorites: (productId: string) => void;
   clearFavorites: () => void;
   isFavorite: (productId: string) => boolean;
   getFavoriteCount: () => number;
}

// UI Store
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
   message: string;
   type: ToastType;
}

export interface UIStore {
   isCartOpen: boolean;
   openCart: () => void;
   closeCart: () => void;
   toggleCart: () => void;
   toast: Toast | null;
   showToast: (message: string, type?: ToastType) => void;
   hideToast: () => void;
}
