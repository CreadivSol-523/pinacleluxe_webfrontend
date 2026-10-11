"use client";

import { ReactNode } from "react";
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
         <RouteChangeLoader />

         {children}
      </Provider>
   );
}
