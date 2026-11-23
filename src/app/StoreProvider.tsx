"use client";

import { ReactNode, Suspense } from "react";
import { Provider } from "react-redux";

import { store } from "@/redux/store";
import LoaderOverlay from "@/components/Loader/LoaderOverlay";
import RouteChangeLoader from "@/components/Loader/RouteChangeLoader";
import InitialLoader from "@/components/Loader/InitialLoader";

interface StoreProviderProps {
   children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
   return (
      <Provider store={store}>
         <InitialLoader />
         <LoaderOverlay />
         <Suspense fallback={null}>
            <RouteChangeLoader />
         </Suspense>

         {children}
      </Provider>
   );
}
