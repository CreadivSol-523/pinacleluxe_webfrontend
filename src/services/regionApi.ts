import BaseAPI from "./api";

// Types
export interface Region {
  _id: string;
  code: string;
  name: string;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegionsResponse {
  success: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  regions: Region[];
}

export interface SingleRegionResponse {
  success: boolean;
  region: Region;
}

export interface CreateRegionPayload {
  code: string;
  name: string;
  currency: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRegionPayload {
  code?: string;
  name?: string;
  currency?: string;
  description?: string;
  isActive?: boolean;
}

// API Functions
class RegionAPI extends BaseAPI {
  static async getRegions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<RegionsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const query = queryParams.toString();
    return this.request<RegionsResponse>(
      `/region${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  }

  static async getRegionById(id: string): Promise<SingleRegionResponse> {
    return this.request<SingleRegionResponse>(`/region/${id}`, {
      method: "GET",
    });
  }

  static async createRegion(
    payload: CreateRegionPayload
  ): Promise<SingleRegionResponse> {
    return this.request<SingleRegionResponse>("/region", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async updateRegion(
    id: string,
    payload: UpdateRegionPayload
  ): Promise<SingleRegionResponse> {
    return this.request<SingleRegionResponse>(`/region/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async deleteRegion(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/region/${id}`,
      { method: "DELETE" }
    );
  }
}

export default RegionAPI;
