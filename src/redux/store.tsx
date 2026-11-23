import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import CategorySlice from "./Category/CategorySlice";
import RegionSlice from "./Region/RegionSlice";
import ProductSlice from "./Product/ProductSlice";
import WebSectionSlice from "./WebSections/WebSectionSlice";
import OrderSlice from "./Order/OrderSlice";
import PaymentSlice from "./Payment/PaymentSlice";

export const store = configureStore({
   reducer: {
      [CategorySlice.reducerPath]: CategorySlice.reducer,
      [RegionSlice.reducerPath]: RegionSlice.reducer,
      [ProductSlice.reducerPath]: ProductSlice.reducer,
      [WebSectionSlice.reducerPath]: WebSectionSlice.reducer,
      [OrderSlice.reducerPath]: OrderSlice.reducer,
      [PaymentSlice.reducerPath]: PaymentSlice.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
         .concat(CategorySlice.middleware)
         .concat(RegionSlice.middleware)
         .concat(ProductSlice.middleware)
         .concat(WebSectionSlice.middleware)
         .concat(OrderSlice.middleware)
         .concat(PaymentSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
