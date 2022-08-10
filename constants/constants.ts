import { Dimensions, StyleSheet } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;

export const SIZE_1 = Math.round(SCREEN_WIDTH / 3); //120px for 360

export const SIZE_2 = Math.round(SCREEN_WIDTH * 0.4); //144px for 360

export const SIZE_3 = Math.round(SCREEN_WIDTH / 24); //15px for 360

export const SIZE_4 = Math.round(SCREEN_WIDTH / 60); //6px for 360px

export const SIZE_5 = Math.round(SCREEN_WIDTH / 30); //12px for 360px;

export const SIZE_6 = Math.round(SCREEN_WIDTH / 20); //18px for 360px;

export const SIZE_7 = Math.round(SCREEN_WIDTH / 120); //3px for 360px;

export const SIZE_8 = Math.round(SCREEN_WIDTH / 40); //9px for 360px;

export const SIZE_9 = Math.round(SCREEN_WIDTH / 15); //24px for 360px;

export const SIZE_10 = Math.round(SCREEN_WIDTH / 22.5); //16px for 360px;

export const SIZE_11 = Math.round(SCREEN_WIDTH / 16.3); //22px for 360px;

export const SIZE_12 = Math.round(SCREEN_WIDTH / 10); //36px for 360px;

export const SIZE_13 = Math.round(SCREEN_WIDTH / 9); //40px for 360px;

export const SIZE_14 = Math.round(SCREEN_WIDTH / 12); //30px for 360px;

export const SIZE_15 = Math.round(SCREEN_WIDTH / 8); //45px for 360px;

export const SIZE_16 = Math.round(SCREEN_WIDTH / 4); //90px for 360px

export const SIZE_17 = Math.round(SCREEN_WIDTH / 4.5); //80px for 360px

export const SIZE_18 = Math.round(SCREEN_WIDTH / 3.6); //100px for 360px

export const SIZE_19 = Math.round(SCREEN_WIDTH * 1.2); //400px for 360px

export const SIZE_20 = Math.round(SCREEN_WIDTH / 6); //60px for 360px

export const SIZE_21 = Math.round(SCREEN_WIDTH / 7.5); //48px for 360px

export const SIZE_22 = Math.round(SCREEN_WIDTH / 13.5); //27px for 360px

export const SIZE_23 = Math.round(SCREEN_WIDTH / 18); //20px for 360px

export const SIZE_24 = Math.round(SCREEN_WIDTH / 21); //17px for 360px

export const SIZE_25 = Math.round(SCREEN_WIDTH / 25); //14px for 360px

export const SIZE_26 = Math.round(SCREEN_WIDTH / 90); //4px for 360px

export const SIZE_27 = Math.round(SCREEN_WIDTH / 8.5); //42px for 360px

export const SIZE_28 = Math.round(SCREEN_WIDTH / 1.44); //250px for 360px

export const SIZE_29 = Math.round(SCREEN_WIDTH / 2); //180px for 360px

export const SIZE_30 = Math.round(SCREEN_WIDTH * 0.75); //270px for 360px

export const SIZE_31 = Math.round(SCREEN_WIDTH / 2.4); //150px for 360px

export const SIZE_32 = Math.round(SCREEN_WIDTH / 1.2); //300px for 360px

export const SIZE_33 = Math.round(SCREEN_WIDTH * 1.25); //450px for 360px

export const SIZE_34 = Math.round(SCREEN_WIDTH / 5); //72px for 360px

export const SIZE_35 = Math.round(SCREEN_WIDTH * 1.5); //540px for 360px

export const SIZE_36 = Math.round(SCREEN_WIDTH / 1.8); //200px for 360px

export const DAY_IN_MILISECONDS = 3600 * 1000;

export const COLOR_1 = "#3f71f2";
export const COLOR_2 = "#ff4ed8";
export const COLOR_3 = "#bc4eff";
export const COLOR_4 = "#4eff5f";
export const COLOR_5 = "#6f6f6f"; //info foreground
export const COLOR_6 = "rgba(0, 0, 0, 0.3)";
export const COLOR_7 = "black"; //primary foreground
export const COLOR_8 = "white"; //primary background
export const COLOR_9 = "rgba(0, 0, 0, 0.8)";
export const COLOR_10 = "#EE3434";
export const COLOR_11 = "rgba(0, 0, 0, 0.5)";
export const COLOR_12 = "#474747"; //secondary foreground
export const COLOR_13 = "#ebebeb"; //secondary background
export const COLOR_14 = "red";
export const COLOR_15 = "#1BE923";
export const COLOR_19 = "#D7D7D7"; //info background

export const IMAGE_POST_CONTENT_HEIGHT = Math.round(SCREEN_WIDTH * 1.25);
export const SHORTS_POST_CONTENT_HEIGHT = Math.round(SCREEN_WIDTH * 1.4);
export const VIDEO_POST_CONTENT_HEIGHT = SCREEN_WIDTH;

export const SHUTTER_ANIMATION_DURATION_MS = 200;
export const TAB_BAR_HEIGHT = SIZE_21;

export const MODAL_ANIMATION_DURATION_MS = 300;

export const HEADER_HEIGHT = SIZE_20 - SIZE_4;

export const IMAGE_BLUR_RADIUS = 10;

export const IMAGE_FADE_DURATION_MS = 800;

export const DOUBLE_TAP_POPUP_ANIMATION_VELOCITY = 5;
export const DOUBLE_TAP_POPUP_ANIMATION_DELAY = 200;
export const DOUBLE_TAP_POPUP_ANIMATION_END_DURATION = 200;

export const FADE_ANIMATION_DURATION_MS = 300;

export const LIST_MINIMUM_VIEW_TIME_MS = 200;

export const LIST_ITEM_ANIMATION_TIME_MS = 800;

export const LAYOUT_ANIMATION_DURATION_MS = 300;

export const LONG_PRESS_DURATION_MS = 200;

export const DOUBLE_TAP_DURATION_MS = 400;

export const ACCOUNT_LIST_ITEM_SIZE = SIZE_20 + 2 * SIZE_4;

export const STORY_LIST_ITEM_SIZE = SIZE_34 + 2 * SIZE_4;

export const ASYNC_STORAGE_PROFILE_PICTURE_KEY = "profile-picture";
export const ASYNC_STORAGE_USER_ID_KEY = "user-id";
export const ASYNC_STORAGE_APP_THEME_KEY = "app-theme";
export const ASYNC_STORAGE_API_ACCESS_TOKEN_KEY = "api-access-token";
export const ASYNC_STORAGE_API_REFRESH_TOKEN_KEY = "api-refresh-token";

export const SPRING_ANIMATION_DURAION_MS = 200;
