export interface productCart {
   data: Product;
}

export interface Product {
   _id?: string;
   name?: string;
   slug?: string;
   description?: string;
   categories?: string | string[];
   subCategory?: string;
   badge?: string;
   stock?: number;
   isVariable?: boolean;
   images: (string | File)[];
   gallery: (string | File)[];
   variants: VariantSchema[];
}

export interface colorVariants {
   hex: { code: string; colorName: string };
   images: (string | File)[];
}

export interface RegionPrice {
   _id?: string;
   region: string;
   price: number;
   discountMode?: string;
   discountValue?: number;
   code?: string;
}

export interface VariantSchema {
   material: string;
   price: RegionPrice[];
   colors?: colorVariants[];
   stock?: number;
}
