import { Product } from "../Collection/CollectionTypes";

export interface Cart {
   quantity: number;
   isButton?: boolean;
   product: {
      colorVariants: string;
      id: string;
      images: string;
      material: string;
      name: string;
      price: number;
      stock: number;
      currency: string;
   };
}
export interface FavoriteCart {
   isButton?: boolean;
   product: {
      colorVariants: string;
      id: string;
      images: string;
      material: string;
      name: string;
      price: number;
      stock: number;
      currency: string;
   };
}
