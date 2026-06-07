export interface productCart {
   data: Product;
}

export interface Product {
   _id?: string;
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
   hex: { code: string; colorName: string };
   images: string[];
}

export interface RegionPrice {
   region: string;
   price: number;
   discountMode?: string;
   discountedValue?: number;
}

export interface VariantSchema {
   material: string;
   price: RegionPrice[];
   colors?: colorVariants[];
   discountPrice?: number;
   discountedValue?: number;
   discountMode?: "percentage" | "static";
   stock?: number;
}
