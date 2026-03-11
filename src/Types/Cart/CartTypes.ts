import { Product } from "../Collection/CollectionTypes";

export interface Cart {
   quantity: number;
   product: {
      color: string;
      id: string;
      image: string;
      material: string;
      name: string;
      price: number;
      stock: number;
   };
}
