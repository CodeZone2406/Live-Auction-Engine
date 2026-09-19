import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "./auctionSlice.js";

export const store = configureStore({
  reducer: {
    auction: auctionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
