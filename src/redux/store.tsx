import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import CategorySlice from "./Category/CategorySlice";

export const store = configureStore({
   reducer: {
      [CategorySlice.reducerPath]: CategorySlice.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(CategorySlice.middleware),
});

setupListeners(store.dispatch);
