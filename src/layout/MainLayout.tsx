import Header from "@/ui/Header/Header";
import TopBar from "@/ui/TopBar/TopBar";
import React, { ReactNode } from "react";

type MainLayoutType = {
   children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutType) => {
   return (
      <main className="min-h-screen">
         <TopBar />
         <Header />
         {children}
      </main>
   );
};

export default MainLayout;
