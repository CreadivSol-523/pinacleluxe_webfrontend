import { useNotification } from "@/context/NotificationContext";
import { useCreateWebSectionsMutation, useGetWebSectionsQuery, useUpdateWebSectionsMutation } from "@/redux/WebSections/WebSectionSlice";
import { CarouselConfig, HeroConfig, MediaSectionConfig, SalesBannerConfig, StoriesData, TopBarConfig } from "@/Types/WebSection/WebSection";

type WebsiteSectionType = "topbar" | "salesbanner" | "hero" | "media" | "carousel" | "stories";

type CreateWebSectionPayload = {
    type: WebsiteSectionType;
    form: TopBarConfig | SalesBannerConfig | HeroConfig | MediaSectionConfig | CarouselConfig | StoriesData;
};

// Create WebSections API
export const useCreateWebSectionHandler = () => {
    const [CreateWebSection, { isLoading }] = useCreateWebSectionsMutation();

    const { show } = useNotification();

    const handleCreateWebSection = async ({ form, type }: CreateWebSectionPayload) => {
        try {
            const formData = new FormData();

            // TOPBAR
            if (type === "topbar") {
                const data = form as TopBarConfig;
                const requiredFields = {
                    message: "Top Bar message",
                    bgColor: "Top Bar background color",
                    textColor: "Top Bar text color",
                };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof TopBarConfig]?.toString().trim()
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("message", data.message || "");
                formData.append("bgColor", data.bgColor || "");
                formData.append("textColor", data.textColor || "");
            }

            // SALES BANNER
            else if (type === "salesbanner") {
                const data = form as SalesBannerConfig;

                const requiredFields = {
                    title: "Title",
                    subtitle: "Subtitle",
                    bgColor: "Background color",
                    textColor: "Text color",
                };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof SalesBannerConfig]?.toString().trim()
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("title", data.title.trim());
                formData.append("subtitle", data.subtitle.trim());
                formData.append("bgColor", data.bgColor.trim());
                formData.append("textColor", data.textColor.trim());
                formData.append("btnLabel", data.btnLabel.trim());
                formData.append("btnUrl", data.btnUrl.trim());
                formData.append("btnBgColor", data.btnBgColor.trim());
                formData.append("btnTextColor", data.btnTextColor.trim());
            }

            // HERO
            else if (type === "hero") {
                const data = form as HeroConfig;

                const requiredFields = {
                    desktopImage: "Desktop image",
                    mobileImage: "Mobile image",
                };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof HeroConfig]
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("desktopImage", data.desktopImage || "");
                formData.append("mobileImage", data.mobileImage || "");
            }

            // MEDIA
            else if (type === "media") {
                const data = form as MediaSectionConfig;

                const requiredFields =
                    data.mode === "image"
                        ? {
                            desktopImage: "Desktop image",
                            mobileImage: "Mobile image",
                        }
                        : {
                            video: "Video",
                        };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof MediaSectionConfig]
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("mode", data.mode || "image");

                if (data.mode === "image") {
                    formData.append("desktopImage", data.desktopImage || "");
                    formData.append("mobileImage", data.mobileImage || "");
                }

                if (data.mode === "video") {
                    formData.append("video", data.video || "");
                }
            }
            // MEDIA
            else if (type === "carousel") {
                const data = form as CarouselConfig;


                formData.append("enabled", String(data.enabled));
                formData.append(
                    "slides",
                    JSON.stringify(data.slides.map((s) => ({ text: s.text, image: s.image instanceof File ? "" : s.imagePreview })))
                );
                data.slides.forEach((s, i) => {
                    if (s.image instanceof File) formData.append(`image_${i}`, s.image);
                });
            }

            else if (type === "stories") {
                const data = form as StoriesData;

                const {
                    bannerImageMobile,
                    bannerImageWeb,
                    enabled,
                    sectionImageMobile,
                    sectionImageWeb,
                    subtitle,
                    title
                } = data;

                const isEmpty = [
                    bannerImageMobile,
                    bannerImageWeb,
                    sectionImageMobile,
                    sectionImageWeb,
                    subtitle,
                    title
                ].some(item => item === "");

                if (isEmpty) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `All fields are required`
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("bannerImageWeb", data.bannerImageWeb || "");
                formData.append("bannerImageMobile", data.bannerImageMobile || "");
                formData.append("sectionImageWeb", data.sectionImageWeb || "");
                formData.append("sectionImageMobile", data.sectionImageMobile || "");
                formData.append("title", data.title || "");
                formData.append("subtitle", data.subtitle || "");

            }

            const res = await CreateWebSection({ type, data: formData })

            if (!res.error) {
                show({ type: "banner", variant: "success", message: `${type} section created successfully.` });
                return res
            } else {
                show({ type: "banner", variant: "warning", message: (res.error as unknown as { data: { success: boolean, message: string } })?.data.message || `${type} not created! Please try again.` });
                return res
            }

        } catch (error: any) {
            console.error("Create website section error:", error);

            const message = error?.data?.message || error?.message || `Failed to create ${type} section. Please try again.`;

            show({ type: "banner", variant: "error", message });

            throw error;
        }
    };

    return {
        handleCreateWebSection,
        isLoading,
    };
};



// Get WebSections API
export const useGetWebSectionsHandler = () => {
    const { data, isLoading, isFetching, isError, error, refetch } = useGetWebSectionsQuery();

    return {
        data,
        isLoading: isLoading || isFetching,
        isError,
        error,
        refetch,
    } as const;
};

// Update WebSections API
export const useUpdateWebSectionHandler = () => {
    const [UpdateWebSection, { isLoading }] = useUpdateWebSectionsMutation();

    const { show } = useNotification();

    const handleUpdateWebSection = async ({ form, type }: CreateWebSectionPayload) => {
        try {
            const formData = new FormData();

            // TOPBAR
            if (type === "topbar") {
                const data = form as TopBarConfig;
                const requiredFields = {
                    message: "Top Bar message",
                    bgColor: "Top Bar background color",
                    textColor: "Top Bar text color",
                };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof TopBarConfig]?.toString().trim()
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("message", data.message || "");
                formData.append("bgColor", data.bgColor || "");
                formData.append("textColor", data.textColor || "");
            }

            // SALES BANNER
            else if (type === "salesbanner") {
                const data = form as SalesBannerConfig;

                const requiredFields = {
                    title: "Title",
                    subtitle: "Subtitle",
                    bgColor: "Background color",
                    textColor: "Text color",
                };

                const emptyField = Object.entries(requiredFields).find(
                    ([key]) => !data[key as keyof SalesBannerConfig]?.toString().trim()
                );

                if (emptyField) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `${emptyField[1]} is required.`,
                    });
                }

                formData.append("enabled", String(data.enabled));
                formData.append("title", data.title.trim());
                formData.append("subtitle", data.subtitle.trim());
                formData.append("bgColor", data.bgColor.trim());
                formData.append("textColor", data.textColor.trim());
                formData.append("btnLabel", data.btnLabel.trim());
                formData.append("btnUrl", data.btnUrl.trim());
                formData.append("btnBgColor", data.btnBgColor.trim());
                formData.append("btnTextColor", data.btnTextColor.trim());
            }

            // HERO
            else if (type === "hero") {
                const data = form as HeroConfig;

                const hasDesktopImage =
                    !!data.desktopImage || !!data.desktopImagePreview;

                const hasMobileImage =
                    !!data.mobileImage || !!data.mobileImagePreview;

                if (!hasDesktopImage) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: "Desktop image is required.",
                    });
                }

                if (!hasMobileImage) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: "Mobile image is required.",
                    });
                }

                formData.append("enabled", String(data.enabled));
                console.log(data.desktopImagePreview)
                console.log(data.mobileImagePreview)
                formData.append("desktopImage", data.desktopImage || data.desktopImagePreview);

                formData.append("mobileImage", data.mobileImage || data.mobileImagePreview);
            }

            // MEDIA
            else if (type === "media") {
                const data = form as MediaSectionConfig;

                formData.append("enabled", String(data.enabled));
                formData.append("mode", data.mode || "image");

                if (data.mode === "image") {
                    const hasDesktopImage =
                        !!data.desktopImage || !!data.desktopImagePreview;

                    const hasMobileImage =
                        !!data.mobileImage || !!data.mobileImagePreview;

                    if (!hasDesktopImage) {
                        return show({
                            type: "banner",
                            variant: "warning",
                            message: "Desktop image is required.",
                        });
                    }

                    if (!hasMobileImage) {
                        return show({
                            type: "banner",
                            variant: "warning",
                            message: "Mobile image is required.",
                        });
                    }

                    // Only append actual files
                    if (data.desktopImage) {
                        formData.append("desktopImage", data.desktopImage);
                    }

                    if (data.mobileImage) {
                        formData.append("mobileImage", data.mobileImage);
                    }
                }

                if (data.mode === "video") {
                    const hasVideo =
                        !!data.video || !!data.videoPreview;

                    if (!hasVideo) {
                        return show({
                            type: "banner",
                            variant: "warning",
                            message: "Video is required.",
                        });
                    }

                    // Only append actual new video file
                    if (data.video) {
                        formData.append("video", data.video);
                    }
                }
            }

            // carousel
            else if (type === "carousel") {
                const data = form as CarouselConfig;

                formData.append("enabled", String(data.enabled));
                formData.append(
                    "slides",
                    JSON.stringify(data.slides.map((s) => ({ text: s.text, image: s.image instanceof File ? "" : s.imagePreview })))
                );
                data.slides.forEach((s, i) => {
                    if (s.image instanceof File) formData.append(`image_${i}`, s.image);
                });
            }

            else if (type === "stories") {
                const data = form as StoriesData;

                const {
                    bannerImageMobile,
                    bannerImageWeb,
                    enabled,
                    sectionImageMobile,
                    sectionImageWeb,
                    subtitle,
                    title
                } = data;

                const isEmpty = [
                    bannerImageMobile,
                    bannerImageWeb,
                    sectionImageMobile,
                    sectionImageWeb,
                    subtitle,
                    title
                ].some(item => item === "");

                if (isEmpty) {
                    return show({
                        type: "banner",
                        variant: "warning",
                        message: `All fields are required`
                    });
                }

                formData.append("enabled", String(enabled));
                formData.append("bannerImageWeb", data.bannerImageWeb || "");
                formData.append("bannerImageMobile", data.bannerImageMobile || "");
                formData.append("sectionImageWeb", data.sectionImageWeb || "");
                formData.append("sectionImageMobile", data.sectionImageMobile || "");
                formData.append("title", data.title || "");
                formData.append("subtitle", data.subtitle || "");

            }

            const res = await UpdateWebSection({ type, data: formData })

            if (!res.error) {
                show({ type: "banner", variant: "success", message: `${type} section Update successfully.` });
                return res
            } else {
                show({ type: "banner", variant: "warning", message: (res.error as unknown as { data: { success: boolean, message: string } })?.data.message || `${type} not Update! Please try again.` });
                return res
            }

        } catch (error: any) {
            console.error("Update website section error:", error);

            const message = error?.data?.message || error?.message || `Failed to Update ${type} section. Please try again.`;

            show({ type: "banner", variant: "error", message });

            throw error;
        }
    };

    return {
        handleUpdateWebSection,
        isLoading,
    };
};

const API_URL = process.env.NEXT_PUBLIC_PORT;

export async function getWebSections() {
    try {
        const response = await fetch(`${API_URL}/api/webSection/`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`Web sections API error: ${response.status} ${response.statusText}`);

            return [];
        }

        const res = await response.json();

        if (!Array.isArray(res?.data)) {
            console.error("Invalid web sections data:", res?.data);

            return [];
        }

        return res?.data;
    } catch (error) {
        console.error("Web sections fetch failed:", error);

        return [];
    }
}