import { getWebSections } from "@/modals/WebSectionsModal";
import OurStories from "@/view/User/OurStories/OurStories";
import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "Our Stories",
   description: "Discover the story, heritage, tradition and modern vision behind Lancaster.",
};

const page = async () => {
   const stories = await getWebSections();

   const storiesSection = stories.find((section: any) => section.type === "stories");

   if (!storiesSection?.data) {
      return null;
   }

   return <OurStories storiesData={storiesSection.data} />;
};

export default page;
