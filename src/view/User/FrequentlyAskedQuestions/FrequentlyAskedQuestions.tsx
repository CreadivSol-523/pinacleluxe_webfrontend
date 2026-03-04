import Accordion from "@/components/Accordion/Accordion";
import MainLayout from "@/layout/MainLayout";
import React from "react";

const FrequentlyAskedQuestions = () => {
   return (
      <MainLayout>
         <div className="flex flex-col sm:gap-30 gap-10 py-17.5 items-center justify-center xl:px-40 px-5">
            <h1 className="uppercase text-center">Frequently Asked Questions</h1>
            <Accordion />
         </div>
      </MainLayout>
   );
};

export default FrequentlyAskedQuestions;
