"use client";
import React from "react";

const HeadingSection = () => {
   const [selectedTab, setSelectedTab] = React.useState("Hot Sellers");
   const Tabs = ["Hot Sellers", "Pinacle Special", "New Arrival", "New Arrival"];

   return (
      <div className="flex flex-col gap-24 pb-5 border-b border-gray-200">
         <div>
            <h2 className="uppercase">Enjoy our feature products</h2>
            <p>Created for those who value quality, enjoy limited offers on thoughtfully crafted pieces.</p>
         </div>
         <div className="flex min-[700px]:items-center justify-between max-[700px]:flex-col max-[700px]:gap-3">
            <div className="flex items-center max-[700px]:justify-center gap-4.5 flex-wrap">
               {Tabs.map((tab, i) => (
                  <div key={i} className={`cursor-pointer active:scale-99 py-2 px-6 rounded-full border-2 ${selectedTab === tab ? "border-BtnBlack bg-BtnBlack" : "border-BtnBlack bg-white"} `} onClick={() => setSelectedTab(tab)}>
                     <p className={`${selectedTab === tab ? "text-white" : "text-textBlack"} fontInterMedium! font-semibold! tracking-wide`}>{tab}</p>
                  </div>
               ))}
            </div>
            <p className="text-[#8D8D8D] cursor-pointer max-[700px]:pl-4">Filter</p>
         </div>
      </div>
   );
};

export default HeadingSection;
