"use client";

import { store } from "@/redux/store";
import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";

interface storeProviderProps {
  children: ReactNode;
}

const StoreProvider = ({ children }: storeProviderProps) => {
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof history !== "undefined") {
      setIsWindowLoaded(true);
    }
  }, []);

  return isWindowLoaded ? <Provider store={store}>{children}</Provider> : null;
};

export default StoreProvider;
