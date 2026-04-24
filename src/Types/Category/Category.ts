export interface Category {
   id: string;
   name: string;
   slug: string;
   image: string;
   isActive: boolean;
   parentId: string | null; // null = top-level category
   children?: Category[]; // populated on frontend for tree view
   createdAt?: string;
}

export type CategoryFormData = Omit<Category, "id" | "children" | "createdAt">;
