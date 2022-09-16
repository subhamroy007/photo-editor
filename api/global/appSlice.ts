import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InteractionManager } from "react-native";
import {
  AppSliceState,
  AppThemeTypes,
  LocalData,
  MediaParams,
} from "../../constants/types";

const appSlice = createSlice({
  name: "appSlice",
  initialState: {} as AppSliceState,
  reducers: {
    changeProfilePicture: (state, action: PayloadAction<MediaParams>) => {
      state.profilePicture = action.payload;
    },
    initAppState: (
      state,
      {
        payload: {
          accessToken,
          defaultProfilePicture,
          icons,
          isSystemTheme,
          logo,
          profilePicture,
          refreshToken,
          theme,
          userid,
        },
      }: PayloadAction<LocalData>
    ) => {
      state.accessToken = accessToken;
      state.defaultProfilePicture = defaultProfilePicture;
      state.icons = icons;
      state.interactionId = -100;
      state.isSystemTheme = isSystemTheme;
      state.logo = logo;
      state.profilePicture = profilePicture;
      state.refreshToken = refreshToken;
      state.theme = theme;
      state.userid = userid;
      state.mutedAccounts = [];
      state.unfollowedAccounts = [];
      state.mute = true;
    },
    changeTheme: (state, { payload }: PayloadAction<AppThemeTypes>) => {
      state.theme = payload;
    },
    setInteractionId: (state) => {
      InteractionManager.clearInteractionHandle(state.interactionId);
      state.interactionId = InteractionManager.createInteractionHandle();
    },
    clearInteractionId: (state) => {
      InteractionManager.clearInteractionHandle(state.interactionId);
      state.interactionId = -1000;
    },
    addToUnfollowedAccounts: {
      prepare(userid: string) {
        return {
          payload: userid,
        };
      },
      reducer(state, { payload: userid }: PayloadAction<string>) {
        state.unfollowedAccounts.push(userid);
      },
    },
    addToMutedAccounts: {
      prepare(userid: string) {
        return {
          payload: userid,
        };
      },
      reducer(state, { payload: userid }: PayloadAction<string>) {
        state.mutedAccounts.push(userid);
      },
    },
    toggleMute: (state) => {
      state.mute = !state.mute;
    },
  },
});

export const {
  actions: {
    changeProfilePicture,
    initAppState,
    changeTheme,
    clearInteractionId,
    setInteractionId,
    addToMutedAccounts,
    addToUnfollowedAccounts,
    toggleMute,
  },
  reducer: appReducer,
} = appSlice;
