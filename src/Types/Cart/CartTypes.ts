import { Product } from "../Collection/CollectionTypes";

export interface Cart {
   quantity: number;
   isButton?: boolean;
   product: {
      color: { hex: string; image: string };
      id: string;
      image: string;
      material: string;
      name: string;
      price: number;
      stock: number;
   };
}
