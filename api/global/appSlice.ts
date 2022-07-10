import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppSliceState = {
  cache: {
    isMuted: boolean;
  };
  info: {
    profilePicture: string;
    lastLoginTimestamp: number;
    lastActiveTimstamp: number;
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
};

const appSlice = createSlice({
  name: "appSlice",
  initialState: {
    cache: {
      isMuted: false,
    },
    info: {
      accessToken: "",
      lastActiveTimstamp: 0,
      lastLoginTimestamp: 0,
      profilePicture: "",
      refreshToken: "",
      userId: "",
    },
  } as AppSliceState,
  reducers: {
    changeProfilePicture: (state, action: PayloadAction<string>) => {
      state.info.profilePicture = action.payload;
    },
    initAppState: (state, action: PayloadAction<AppSliceState["info"]>) => {
      state.cache = { isMuted: true };
      state.info = action.payload;
    },
    changeLastActiveTimeStamp: (state, action: PayloadAction<number>) => {
      state.info.lastActiveTimstamp = action.payload;
    },
  },
});

export const {
  actions: { changeLastActiveTimeStamp, changeProfilePicture, initAppState },
  reducer: appReducer,
} = appSlice;
