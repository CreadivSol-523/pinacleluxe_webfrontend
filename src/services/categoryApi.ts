import BaseAPI from "./api";

// Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
  parentId?: string | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  categories: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  category: Category;
}

export interface CreateCategoryPayload {
  name: string;
  isActive?: boolean;
  parentId?: string | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
  parentId?: string | null;
}

// API Functions
class CategoryAPI extends BaseAPI {
  static async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    parentId?: string | "null";
  }): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params?.parentId !== undefined)
      queryParams.append("parentId", params.parentId);

    const query = queryParams.toString();
    return this.request<CategoriesResponse>(
      `/category${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  }

  static async getCategoryById(id: string): Promise<SingleCategoryResponse> {
    return this.request<SingleCategoryResponse>(`/category/${id}`, {
      method: "GET",
    });
  }

  static async createCategory(
    payload: CreateCategoryPayload,
    image?: File
  ): Promise<SingleCategoryResponse> {
    const formData = new FormData();

    formData.append("name", payload.name);
    if (payload.isActive !== undefined)
      formData.append("isActive", payload.isActive.toString());
    if (payload.parentId !== undefined && payload.parentId !== null)
      formData.append("parentId", payload.parentId);

    if (image) {
      formData.append("image", image);
    }

    return this.requestWithFormData<SingleCategoryResponse>(
      "/category",
      formData
    );
  }

  static async updateCategory(
    id: string,
    payload: UpdateCategoryPayload,
    image?: File
  ): Promise<SingleCategoryResponse> {
    const formData = new FormData();

    if (payload.name) formData.append("name", payload.name);
    if (payload.isActive !== undefined)
      formData.append("isActive", payload.isActive.toString());
    if (payload.parentId !== undefined) {
      if (payload.parentId === null) {
        formData.append("parentId", "null");
      } else {
        formData.append("parentId", payload.parentId);
      }
    }

    if (image) {
      formData.append("image", image);
    }

    return this.requestWithFormData<SingleCategoryResponse>(
      `/category/${id}`,
      formData,
      "PUT"
    );
  }

  static async deleteCategory(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/category/${id}`,
      { method: "DELETE" }
    );
  }
}

export default CategoryAPI;
