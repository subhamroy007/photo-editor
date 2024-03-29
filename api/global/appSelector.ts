import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { AppThemeTypes, MediaParams } from "../../constants/types";
import { StoreRootState } from "../store";

export const selectProfilePicuture = createDraftSafeSelector<
  [(state: StoreRootState) => MediaParams],
  MediaParams
>(
  (state) => {
    return state.app.profilePicture;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectDefaultProfilePicuture = createDraftSafeSelector<
  [(state: StoreRootState) => MediaParams],
  MediaParams
>(
  (state) => {
    return state.app.defaultProfilePicture;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectLogo = createDraftSafeSelector<
  [(state: StoreRootState) => MediaParams],
  MediaParams
>(
  (state) => {
    return state.app.logo;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectMuteState = createDraftSafeSelector<
  [(state: StoreRootState) => boolean],
  boolean
>(
  (state) => {
    return state.app.mute;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectAccountId = createDraftSafeSelector<
  [(state: StoreRootState) => string],
  string
>(
  (state) => {
    return state.app.userid;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectAppTheme = createDraftSafeSelector<
  [(state: StoreRootState) => AppThemeTypes],
  AppThemeTypes
>(
  (state) => {
    return state.app.theme;
  },
  (arg0) => {
    return arg0;
  }
);

export const selectIcon = createDraftSafeSelector<
  [(state: StoreRootState, name: string) => string],
  string
>(
  (state, name) => {
    return state.app.icons[name];
  },
  (arg0) => {
    return arg0;
  }
);
