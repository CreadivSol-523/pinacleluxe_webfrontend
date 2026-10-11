import { pagination } from "../Pagination";

// API Types
export interface CreateWebSectionsResponse {
    success: boolean;
}

export interface GetWebSectionsResponse {
    success: boolean;
    data: WebsiteSection[]
}

export interface WebsiteSection {
    _id: string;
    type: "topbar" | "salesbanner" | "hero" | "media" | "carousel" | "stories";
    data: TopBarConfig | SalesBannerConfig | HeroConfig | MediaSectionConfig | CarouselConfig | StoriesConfig;
    createdAt: string;
    updatedAt: string;
}

// TopBar Type
export interface TopBarConfig {
    enabled: boolean;
    message: string;
    bgColor: string;
    textColor: string;
}

// SalesBanner Type
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

// Hero Type
export type HeroConfig = {
    enabled: boolean;
    desktopImage: File | null;
    desktopImagePreview: string;
    mobileImage: File | null;
    mobileImagePreview: string;
};

//  Media Type
type MediaMode = "image" | "video";

export interface MediaSectionConfig {
    enabled: boolean;
    mode: MediaMode;
    desktopImage: File | null;
    desktopImagePreview: string;
    mobileImage: File | null;
    mobileImagePreview: string;
    video: File | null;
    videoPreview: string;
}

// Slider
export type CarouselSlideConfig = {
    image: string | File;
    text: string;
    imagePreview?: string
};

export type CarouselConfig = {
    _id?: string;
    enabled: boolean;
    slides: CarouselSlideConfig[];
};

// Stories Config
export type StoriesData = {
    enabled: boolean
    bannerImageWeb?: string | File
    bannerImageMobile?: string | File
    sectionImageWeb?: string | File
    sectionImageMobile?: string | File
    title: string
    subtitle: string
}

export type StoriesConfig = {
    _id?: string;
    type: string;
    data: StoriesData;
};