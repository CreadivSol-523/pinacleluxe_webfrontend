import BaseAPI from "./api";

// Types
export interface VariantColor {
  hex: {
    code?: string;
    colorName?: string;
  };
  images: string[];
}

export interface RegionPrice {
  region: string | { _id: string; code: string; name: string; currency: string };
  price: number;
  discountMode?: "percentage" | "static";
  discountValue?: number;
}

export interface Variant {
  material: string;
  price: RegionPrice[];
  colors: VariantColor[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categories: Array<string | { _id: string; name: string; slug: string }>;
  badge?: string;
  isVariable: boolean;
  pricing: RegionPrice[];
  images: string[];
  thumbnail: string[];
  variants: Variant[];
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  products: Product[];
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  categories: string[];
  badge?: string;
  isVariable: boolean;
  pricing?: RegionPrice[];
  variants?: Variant[];
  stock?: number;
}

// API Functions
class ProductAPI extends BaseAPI {
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);

    const query = queryParams.toString();
    return this.request<ProductsResponse>(
      `/product${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  }

  static async getProductById(id: string): Promise<SingleProductResponse> {
    return this.request<SingleProductResponse>(`/product/${id}`, {
      method: "GET",
    });
  }

  static async createProduct(
    payload: CreateProductPayload,
    files?: {
      productImages?: FileList | File[];
      thumbnails?: FileList | File[];
      variantImages?: { [key: string]: FileList | File[] };
    }
  ): Promise<SingleProductResponse> {
    const formData = new FormData();

    // Add text fields
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.badge) formData.append("badge", payload.badge);
    formData.append("isVariable", payload.isVariable.toString());
    if (payload.stock !== undefined) formData.append("stock", payload.stock.toString());

    // Add arrays as JSON strings
    formData.append("categories", JSON.stringify(payload.categories));
    if (payload.pricing) formData.append("pricing", JSON.stringify(payload.pricing));
    if (payload.variants) formData.append("variants", JSON.stringify(payload.variants));

    // Add files
    if (files?.productImages) {
      Array.from(files.productImages).forEach((file) => {
        formData.append("productImages", file);
      });
    }

    if (files?.thumbnails) {
      Array.from(files.thumbnails).forEach((file) => {
        formData.append("thumbnails", file);
      });
    }

    if (files?.variantImages) {
      Object.entries(files.variantImages).forEach(([key, fileList]) => {
        Array.from(fileList).forEach((file) => {
          formData.append(key, file);
        });
      });
    }

    return this.requestWithFormData<SingleProductResponse>("/product", formData);
  }

  static async updateProduct(
    id: string,
    payload: Partial<CreateProductPayload>,
    files?: {
      productImages?: FileList | File[];
      thumbnails?: FileList | File[];
      variantImages?: { [key: string]: FileList | File[] };
    }
  ): Promise<SingleProductResponse> {
    const formData = new FormData();

    // Add text fields
    if (payload.name) formData.append("name", payload.name);
    if (payload.description !== undefined) formData.append("description", payload.description);
    if (payload.badge !== undefined) formData.append("badge", payload.badge);
    if (payload.isVariable !== undefined) formData.append("isVariable", payload.isVariable.toString());
    if (payload.stock !== undefined) formData.append("stock", payload.stock.toString());

    // Add arrays as JSON strings
    if (payload.categories) formData.append("categories", JSON.stringify(payload.categories));
    if (payload.pricing) formData.append("pricing", JSON.stringify(payload.pricing));
    if (payload.variants) formData.append("variants", JSON.stringify(payload.variants));

    // Add files
    if (files?.productImages) {
      Array.from(files.productImages).forEach((file) => {
        formData.append("productImages", file);
      });
    }

    if (files?.thumbnails) {
      Array.from(files.thumbnails).forEach((file) => {
        formData.append("thumbnails", file);
      });
    }

    if (files?.variantImages) {
      Object.entries(files.variantImages).forEach(([key, fileList]) => {
        Array.from(fileList).forEach((file) => {
          formData.append(key, file);
        });
      });
    }

    return this.requestWithFormData<SingleProductResponse>(
      `/product/${id}`,
      formData,
      "PUT"
    );
  }

  static async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/product/${id}`,
      { method: "DELETE" }
    );
  }
}

export default ProductAPI;
