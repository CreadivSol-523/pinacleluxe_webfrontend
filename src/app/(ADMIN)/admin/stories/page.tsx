"use client";
import { useCreateWebSectionHandler, useGetWebSectionsHandler, useUpdateWebSectionHandler } from "@/modals/WebSectionsModal";
import { StoriesConfig } from "@/Types/WebSection/WebSection";
import StoriesPage from "@/view/Admin/Stories/StoriesPage";
import React, { useEffect, useState } from "react";

const page = () => {
   const [storyData, setStoryData] = useState({});

   const { handleCreateWebSection, isLoading } = useCreateWebSectionHandler();

   const { data, isLoading: getWebSectionLoading } = useGetWebSectionsHandler();

   const { handleUpdateWebSection } = useUpdateWebSectionHandler();

   useEffect(() => {
      if (!data?.data) return;

      const sections = data.data;

      const stories = sections.find((section) => section.type === "stories");

      setStoryData({
         _id: stories?._id,
         ...stories?.data,
      });
   }, [getWebSectionLoading]);

   return <StoriesPage handleCreateWebSection={(value) => handleCreateWebSection({ form: value, type: "stories" })} handleUpdateStories={(value) => handleUpdateWebSection({ form: value, type: "stories" })} StoriesData={storyData as StoriesConfig} />;
};

export default page;
