export interface productCart {
   data: Product;
}

export interface Product {
   id?: string;
   slug?: string;
   name?: string;
   price?: number;
   discountPrice?: number;
   discount?: number;
   badge?: string;
   stock?: number;
   category?: string;
   colors?: ProductColor[];
   material: string[];
   images: string[];
   gallery: string[];
}

export interface ProductColor {
   hex: string;
   image: string;
}
