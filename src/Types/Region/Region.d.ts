import { pagination } from "../Pagination";

export interface Region {
   _id: string;
   code: string;
   name: string;
   currency: string;
   description?: string;
   isActive: boolean;
}

// API Types
export interface CreateRegionResponse {
   success: boolean;
   region: {
      code: string;
      name: string;
      currency: string;
      description: string;
      isActive: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
   };
}

export interface GetRegionResponse {
   success: boolean;
   pagination: pagination;
   regions: Region[];
}
