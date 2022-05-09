import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { RootStackNavigator } from "./navigators/RootStackNavigator";
import { RootSwipeNavigator } from "./navigators/RootSwipeNavigator";

export default function App() {
  const [loaded, _] = useFonts({
    icons: require("./assets/fonts/icons.ttf"),
    "ubuntu-regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
    "ubuntu-medium": require("./assets/fonts/Ubuntu-Medium.ttf"),
    "ubuntu-bold": require("./assets/fonts/Ubuntu-Bold.ttf"),
    "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
          <RootStackNavigator />
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
