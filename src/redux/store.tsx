import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import CategorySlice from "./Category/CategorySlice";
import RegionSlice from "./Region/RegionSlice";

export const store = configureStore({
   reducer: {
      [CategorySlice.reducerPath]: CategorySlice.reducer,
      [RegionSlice.reducerPath]: RegionSlice.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(CategorySlice.middleware).concat(RegionSlice.middleware),
});

setupListeners(store.dispatch);
