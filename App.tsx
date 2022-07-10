import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as Asset from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { RootStackNavigator } from "./navigators/RootStackNavigator";
import { Provider } from "react-redux";
import { initStore, store } from "./api/store";
import { globalStyles } from "./constants/style";

export default function App() {
  const [isAppReady, setAppReady] = useState(false);

  const initApp = useCallback(async () => {
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
    await Asset.Asset.loadAsync([
      require("./assets/icons/logo.png"),
      require("./assets/icons/defaultprofilepicture.png"),
      require("./assets/icons/defaultprofilepicturex2.png"),
      require("./assets/icons/defaultprofilepicturex4.png"),
    ]);

    //populate the global store with initial app data
    await initStore();

    setAppReady(true);
  }, []);

  useEffect(() => {
    initApp();
  }, []);

  const onNavigationStateReady = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
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
