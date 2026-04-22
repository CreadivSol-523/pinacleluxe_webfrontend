export interface productCart {
   data: Product;
}

// export interface Product {
//    id?: string;
//    name?: string;
//    slug?: string;
//    description?: string;
//    category?: string;
//    subCategory?: string;
//    badge?: string;
//    isVariable?: boolean;
//    price?: number;
//    discountPrice?: number;
//    discount?: number;
//    stock?: number;
//    material: material[];
//    images: string[];
//    gallery: string[];
//    colorVariants: colorVariants[];
//    discountMode?: "percentage" | "static";
//    VariantSchema: VariantSchema[];
// }

export interface Product {
   id?: string;
   name?: string;
   slug?: string;
   description?: string;
   category?: string;
   subCategory?: string;
   badge?: string;
   isVariable?: boolean;
   images: string[];
   gallery: string[];
   VariantSchema: VariantSchema[];
}

export interface colorVariants {
   hex: string;
   images: string[];
}

export interface VariantSchema {
   material: string;
   price: number | null;
   colors?: colorVariants[];
   discountPrice?: number;
   discountMode?: "percentage" | "static";
   stock?: number;
}
