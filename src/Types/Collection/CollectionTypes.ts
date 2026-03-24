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
   description?: string;
   badge?: string;
   stock?: number;
   category?: string;
   subCategory?: string;
   material: string[];
   isVariable?: boolean;
   images: string[];
   gallery: string[];
   colorVariants: colorVariants[];
   discountMode?: "percentage" | "static";
}

export interface colorVariants {
   hex: string;
   images: string[];
}
