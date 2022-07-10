import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { StoreRootState } from "../store";

export const selectLastActiveTimeStamp = createDraftSafeSelector<
  [(state: StoreRootState) => number],
  number
>(
  (state) => {
    return state.app.info.lastActiveTimstamp;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectProfilePicuture = createDraftSafeSelector<
  [(state: StoreRootState) => string],
  string
>(
  (state) => {
    return state.app.info.profilePicture;
  },
  (arg0) => {
    return arg0;
  }
);
