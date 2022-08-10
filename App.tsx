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

      //load all the icons required in your application
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
          isFullScreenActive: false,
          isMuted: false,
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
