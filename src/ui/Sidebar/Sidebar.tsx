import Button from "@/components/Button/Button";
import SidebarCard from "@/components/Cards/SidebarCard/SidebarCard";
import { X } from "lucide-react";
import React from "react";

const Sidebar = ({ isOpen, setIsSidebarOpen }: { isOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) => {
   return (
      <aside className={`sm:w-100 w-full h-full bg-white fixed transition-all duration-500 ${isOpen ? "sm:right-0 translate-x-0" : "sm:-right-full  translate-x-full"} z-60!`}>
         <div className="p-5 flex justify-between items-center border-b border-b-gray-200">
            <h3>Shopping Bag</h3>
            <X className="cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
         </div>
         <div className="flex items-start py-10 justify-start px-6 h-full">
            <div className="flex flex-col gap-5.5">
               <SidebarCard />
               <SidebarCard />
               <SidebarCard />
            </div>
            <div className="absolute bottom-3 w-full px-6 left-0 right-0 flex justify-center items-center">
               <Button name="Shop All" mainClass="w-full" />
            </div>
         </div>
      </aside>
   );
};

export default Sidebar;
