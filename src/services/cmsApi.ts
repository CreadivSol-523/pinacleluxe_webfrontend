import BaseAPI from "./api";

// Types for CMS Sections
export interface TopBarConfig {
  enabled: boolean;
  message: string;
  bgColor: string;
  textColor: string;
}

export interface SalesBannerConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  btnLabel: string;
  btnUrl: string;
  btnBgColor: string;
  btnTextColor: string;
}

export interface HeroConfig {
  enabled: boolean;
  desktopImage: string;
  mobileImage: string;
}

export interface MediaSectionConfig {
  enabled: boolean;
  mode: "image" | "video";
  desktopImage: string;
  mobileImage: string;
  video: string;
}

export type CmsSectionType = "topbar" | "salesbanner" | "hero" | "media";

export interface CmsSection {
  _id: string;
  sectionType: CmsSectionType;
  enabled: boolean;
  data: TopBarConfig | SalesBannerConfig | HeroConfig | MediaSectionConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AllCmsSectionsResponse {
  success: boolean;
  sections: CmsSection[];
}

export interface SingleCmsSectionResponse {
  success: boolean;
  section: CmsSection;
}

export interface UpdateCmsSectionPayload {
  enabled: boolean;
  data: TopBarConfig | SalesBannerConfig | HeroConfig | MediaSectionConfig;
}

// API Functions
class CmsAPI extends BaseAPI {
  /**
   * Get all CMS sections
   */
  static async getAllSections(): Promise<AllCmsSectionsResponse> {
    return this.request<AllCmsSectionsResponse>("/cms", {
      method: "GET",
    });
  }

  /**
   * Get a specific CMS section by type
   */
  static async getSection(
    sectionType: CmsSectionType
  ): Promise<SingleCmsSectionResponse> {
    return this.request<SingleCmsSectionResponse>(`/cms/${sectionType}`, {
      method: "GET",
    });
  }

  /**
   * Update or create a CMS section
   */
  static async updateSection(
    sectionType: CmsSectionType,
    payload: UpdateCmsSectionPayload
  ): Promise<SingleCmsSectionResponse> {
    return this.request<SingleCmsSectionResponse>(`/cms/${sectionType}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Delete a CMS section (reset to defaults)
   */
  static async deleteSection(
    sectionType: CmsSectionType
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/cms/${sectionType}`,
      { method: "DELETE" }
    );
  }

  // Convenience methods for specific sections
  static async getTopBar(): Promise<SingleCmsSectionResponse> {
    return this.getSection("topbar");
  }

  static async updateTopBar(
    data: TopBarConfig
  ): Promise<SingleCmsSectionResponse> {
    return this.updateSection("topbar", { enabled: data.enabled, data });
  }

  static async getSalesBanner(): Promise<SingleCmsSectionResponse> {
    return this.getSection("salesbanner");
  }

  static async updateSalesBanner(
    data: SalesBannerConfig
  ): Promise<SingleCmsSectionResponse> {
    return this.updateSection("salesbanner", { enabled: data.enabled, data });
  }

  static async getHero(): Promise<SingleCmsSectionResponse> {
    return this.getSection("hero");
  }

  static async updateHero(data: HeroConfig): Promise<SingleCmsSectionResponse> {
    return this.updateSection("hero", { enabled: data.enabled, data });
  }

  static async getMediaSection(): Promise<SingleCmsSectionResponse> {
    return this.getSection("media");
  }

  static async updateMediaSection(
    data: MediaSectionConfig
  ): Promise<SingleCmsSectionResponse> {
    return this.updateSection("media", { enabled: data.enabled, data });
  }
}

export default CmsAPI;
