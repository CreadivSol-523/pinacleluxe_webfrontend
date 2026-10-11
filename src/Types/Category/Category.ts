export interface Category {
   _id: string;
   name: string;
   slug: string;
   image: string | File;
   isActive: boolean;
   parentId: string | null;
   children?: Category[];
   createdAt?: string;
}

export type CategoryFormData = Omit<Category, "_id" | "children" | "createdAt">;
