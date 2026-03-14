"use client";

import { ILiveStatusData } from "@/types/liveMatchDetails/liveStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ILiveStatusState {
  liveStatus: ILiveStatusData | null;
  isHydrated: boolean;
}

const initialState: ILiveStatusState = {
  liveStatus: null,
  isHydrated: false,
};

const liveStatusSlice = createSlice({
  name: "liveStatus",
  initialState,
  reducers: {
    setLiveStatus: (state, action: PayloadAction<ILiveStatusData | null>) => {
      state.liveStatus = action.payload;
      state.isHydrated = true;
    },
    clearLiveStatus: (state) => {
      state.liveStatus = null;
      state.isHydrated = true;
    },
  },
});

export const { setLiveStatus, clearLiveStatus } = liveStatusSlice.actions;
export default liveStatusSlice.reducer;
