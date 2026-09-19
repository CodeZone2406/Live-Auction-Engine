import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Bid } from "../../../shared/contracts";

export type { Bid } from "../../../shared/contracts";

export interface AuctionState {
  isConnected: boolean;
  highestBid: number;
  bidHistory: Bid[];
}

const initialState: AuctionState = {
  isConnected: false,
  highestBid: 0,
  bidHistory: [],
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateHighestBid: (state, action: PayloadAction<Bid>) => {
      state.highestBid = action.payload.amount;
      state.bidHistory.unshift(action.payload);
    },
  },
});

export const { setConnectionStatus, updateHighestBid } = auctionSlice.actions;
export default auctionSlice.reducer;
