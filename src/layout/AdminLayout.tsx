"use client";

import { useState } from "react";
import Sidebar from "@/ui/Admin/Sidebar/Sidebar";
import Topbar from "@/ui/Admin/Topbar/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   const [sidebarOpen, setSidebarOpen] = useState(false);

   return (
      <div className="flex h-screen overflow-hidden bg-staticSecondaryBG">
         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <Topbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-7 bg-[#F5F0E8]">{children}</main>
         </div>
      </div>
   );
}
