import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as Asset from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackNavigator } from "./navigators/RootStackNavigator";
import { Provider } from "react-redux";
import { store } from "./api/store";
import { globalStyles } from "./constants/style";
import { AppThemeTypes, MediaParams } from "./constants/types";
import { Appearance, Platform, UIManager } from "react-native";
import { changeTheme, initAppState } from "./api/global/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ASYNC_STORAGE_API_ACCESS_TOKEN_KEY,
  ASYNC_STORAGE_API_REFRESH_TOKEN_KEY,
  ASYNC_STORAGE_APP_THEME_KEY,
  ASYNC_STORAGE_PROFILE_PICTURE_KEY,
  ASYNC_STORAGE_USER_ID_KEY,
} from "./constants/constants";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  const [isAppReady, setAppReady] = useState(false);

  const initApp = useCallback(async () => {
    try {
      //show splash screen
      await SplashScreen.preventAutoHideAsync();

      //load all the fonts required in your application
      await Font.loadAsync({
        icons: require("./assets/fonts/icons.ttf"),
        "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
        "roboto-medium": require("./assets/fonts/Roboto-Medium.ttf"),
        "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
      });

      //load all the icons required in the application
      const localImages = (
        await Asset.Asset.loadAsync([
          require("./assets/images/logo.png"),
          require("./assets/images/defaultprofilepicture.png"),
        ])
      ).map<MediaParams>((item) => ({
        height: item.height!,
        uri: item.localUri!,
        width: item.width!,
      }));

      const appIcons: { [key: string]: string } = {};

      //load all the icons required in the application
      (
        await Asset.Asset.loadAsync([
          require("./assets/icons/account-outline.png"),
          require("./assets/icons/about.png"),
          require("./assets/icons/arrow-down.png"),
          require("./assets/icons/arrow-up.png"),
          require("./assets/icons/arrow-left.png"),
          require("./assets/icons/arrow-right.png"),
          require("./assets/icons/block.png"),
          require("./assets/icons/bookmark-outline.png"),
          require("./assets/icons/bookmark-solid.png"),
          require("./assets/icons/boomerang.png"),
          require("./assets/icons/burger.png"),
          require("./assets/icons/brush.png"),
          require("./assets/icons/ellipses.png"),
          require("./assets/icons/camera-flip.png"),
          require("./assets/icons/camera-outline.png"),
          require("./assets/icons/camera-solid.png"),
          require("./assets/icons/caption-outline.png"),
          require("./assets/icons/caption-solid.png"),
          require("./assets/icons/chevron-down.png"),
          require("./assets/icons/chevron-up.png"),
          require("./assets/icons/chevron-left.png"),
          require("./assets/icons/chevron-right.png"),
          require("./assets/icons/clipboard.png"),
          require("./assets/icons/close.png"),
          require("./assets/icons/comment.png"),
          require("./assets/icons/create.png"),
          require("./assets/icons/download.png"),
          require("./assets/icons/draw.png"),
          require("./assets/icons/edit-outline.png"),
          require("./assets/icons/edit-solid.png"),
          require("./assets/icons/effect.png"),
          require("./assets/icons/emoji.png"),
          require("./assets/icons/eraser.png"),
          require("./assets/icons/expand.png"),
          require("./assets/icons/favourite.png"),
          require("./assets/icons/filter.png"),
          require("./assets/icons/finder.png"),
          require("./assets/icons/flash-off.png"),
          require("./assets/icons/flash-on.png"),
          require("./assets/icons/folder.png"),
          require("./assets/icons/follow.png"),
          require("./assets/icons/following.png"),
          require("./assets/icons/font.png"),
          require("./assets/icons/forward.png"),
          require("./assets/icons/grid.png"),
          require("./assets/icons/hashtag.png"),
          require("./assets/icons/heart-outline.png"),
          require("./assets/icons/heart-solid.png"),
          require("./assets/icons/help.png"),
          require("./assets/icons/hide.png"),
          require("./assets/icons/history.png"),
          require("./assets/icons/home-outline.png"),
          require("./assets/icons/home-solid.png"),
          require("./assets/icons/info.png"),
          require("./assets/icons/layout.png"),
          require("./assets/icons/layout-1.png"),
          require("./assets/icons/layout-2.png"),
          require("./assets/icons/layout-3.png"),
          require("./assets/icons/link.png"),
          require("./assets/icons/live.png"),
          require("./assets/icons/location.png"),
          require("./assets/icons/lock.png"),
          require("./assets/icons/maximize.png"),
          require("./assets/icons/memories.png"),
          require("./assets/icons/mention.png"),
          require("./assets/icons/message-outline.png"),
          require("./assets/icons/message-solid.png"),
          require("./assets/icons/mic-off.png"),
          require("./assets/icons/mic-on.png"),
          require("./assets/icons/minimize.png"),
          require("./assets/icons/moments-outline.png"),
          require("./assets/icons/moments-solid.png"),
          require("./assets/icons/more.png"),
          require("./assets/icons/multicapture.png"),
          require("./assets/icons/multiselect.png"),
          require("./assets/icons/music.png"),
          require("./assets/icons/mute.png"),
          require("./assets/icons/next.png"),
          require("./assets/icons/notification-outline.png"),
          require("./assets/icons/notification-solid.png"),
          require("./assets/icons/paperclip.png"),
          require("./assets/icons/pause.png"),
          require("./assets/icons/phone-outline.png"),
          require("./assets/icons/phone-solid.png"),
          require("./assets/icons/pin-solid.png"),
          require("./assets/icons/play.png"),
          require("./assets/icons/previous.png"),
          require("./assets/icons/report.png"),
          require("./assets/icons/retry.png"),
          require("./assets/icons/search-regular.png"),
          require("./assets/icons/search-solid.png"),
          require("./assets/icons/security.png"),
          require("./assets/icons/send.png"),
          require("./assets/icons/settings-outline.png"),
          require("./assets/icons/settings-solid.png"),
          require("./assets/icons/share.png"),
          require("./assets/icons/show.png"),
          require("./assets/icons/star.png"),
          require("./assets/icons/sticker.png"),
          require("./assets/icons/tag-regular.png"),
          require("./assets/icons/tag-solid.png"),
          require("./assets/icons/tick.png"),
          require("./assets/icons/timer.png"),
          require("./assets/icons/timer-15.png"),
          require("./assets/icons/timer-30.png"),
          require("./assets/icons/timer-60.png"),
          require("./assets/icons/trash.png"),
          require("./assets/icons/trending-outline.png"),
          require("./assets/icons/trending-solid.png"),
          require("./assets/icons/undo.png"),
          require("./assets/icons/upload.png"),
          require("./assets/icons/user-solid.png"),
          require("./assets/icons/user-solid.png"),
          require("./assets/icons/vibrance.png"),
          require("./assets/icons/video-outline.png"),
          require("./assets/icons/video-solid.png"),
          require("./assets/icons/video-recorder-outline.png"),
          require("./assets/icons/video-recorder-solid.png"),
          require("./assets/icons/volume-high.png"),
        ])
      ).forEach((item) => {
        const sections = item.uri.split("/");
        const lastSection = sections[sections.length - 1];
        const [iconName, extension] = lastSection.split(".");
        appIcons[iconName] = item.localUri!;
      });

      const accessToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_API_ACCESS_TOKEN_KEY
      );

      const refreshToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_API_REFRESH_TOKEN_KEY
      );

      const theme = await AsyncStorage.getItem(ASYNC_STORAGE_APP_THEME_KEY);

      const profilePicture = await AsyncStorage.getItem(
        ASYNC_STORAGE_PROFILE_PICTURE_KEY
      );

      const userid = await AsyncStorage.getItem(ASYNC_STORAGE_USER_ID_KEY);

      const systemTheme = Appearance.getColorScheme();

      store.dispatch(
        initAppState({
          accessToken: accessToken ? accessToken : "",
          defaultProfilePicture: localImages[1],
          logo: localImages[0],
          profilePicture: profilePicture
            ? (JSON.parse(profilePicture) as MediaParams)
            : localImages[1],
          refreshToken: refreshToken ? refreshToken : "",
          theme: theme
            ? (theme as AppThemeTypes)
            : systemTheme
            ? systemTheme
            : "light",
          userid: userid ? userid : "guestaccount",
          isSystemTheme: theme ? false : true,
          icons: appIcons,
        })
      );

      setAppReady(true);
    } catch (error) {
      console.log("something went wrong");
    }
  }, []);

  useEffect(() => {
    initApp();

    const onSystemThemeChange: Appearance.AppearanceListener = ({
      colorScheme,
    }) => {
      if (store.getState().app.isSystemTheme) {
        store.dispatch(changeTheme(colorScheme === "dark" ? "dark" : "light"));
      }
    };

    Appearance.addChangeListener(onSystemThemeChange);

    return () => {
      Appearance.removeChangeListener(onSystemThemeChange);
    };
  }, []);

  const onNavigationStateReady = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={globalStyles.flex1}>
          <NavigationContainer onReady={onNavigationStateReady}>
            <RootStackNavigator />
          </NavigationContainer>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  );
}
