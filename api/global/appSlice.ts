import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppSliceState,
  AppThemeTypes,
  MediaParams,
} from "../../constants/types";

const appSlice = createSlice({
  name: "appSlice",
  initialState: {} as AppSliceState,
  reducers: {
    changeProfilePicture: (state, action: PayloadAction<MediaParams>) => {
      state.profilePicture = action.payload;
    },
    initAppState: (state, { payload }: PayloadAction<AppSliceState>) => {
      state.accessToken = payload.accessToken;
      state.defaultProfilePicture = payload.defaultProfilePicture;
      state.isMuted = payload.isMuted;
      state.logo = payload.logo;
      state.profilePicture = payload.profilePicture;
      state.refreshToken = state.refreshToken;
      state.userid = state.userid;
      state.isFullScreenActive = state.isFullScreenActive;
      state.isSystemTheme = state.isSystemTheme;
      state.theme = payload.theme;
    },
    toggleMuteState: (state) => {
      state.isMuted = !state.isMuted;
    },
    activateFullScreen: (state) => {
      state.isFullScreenActive = true;
    },
    deActivateFullScreen: (state) => {
      state.isFullScreenActive = false;
    },
    changeTheme: (state, { payload }: PayloadAction<AppThemeTypes>) => {
      state.theme = payload;
    },
  },
});

export const {
  actions: {
    changeProfilePicture,
    initAppState,
    toggleMuteState,
    activateFullScreen,
    deActivateFullScreen,
    changeTheme,
  },
  reducer: appReducer,
} = appSlice;
