import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import CategorySlice from "./Category/CategorySlice";
import RegionSlice from "./Region/RegionSlice";
import ProductSlice from "./Product/ProductSlice";

export const store = configureStore({
   reducer: {
      [CategorySlice.reducerPath]: CategorySlice.reducer,
      [RegionSlice.reducerPath]: RegionSlice.reducer,
      [ProductSlice.reducerPath]: ProductSlice.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(CategorySlice.middleware).concat(RegionSlice.middleware).concat(ProductSlice.middleware),
});

setupListeners(store.dispatch);
