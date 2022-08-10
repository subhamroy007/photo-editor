import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  selectAppTheme,
  selectFullScreenActiveState,
  selectProfilePicuture,
} from "../../api/global/appSelector";
import {
  COLOR_7,
  COLOR_8,
  SIZE_5,
  SIZE_9,
  TAB_BAR_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppIcon } from "./AppIcon";
import { AppModal } from "./AppModal";

export function Shutter(props: BottomTabBarProps) {
  const {
    state: { index, routes },
    navigation,
  } = props;

  const isFullScreenActive = useStoreSelector(selectFullScreenActiveState);

  const theme = useStoreSelector(selectAppTheme);

  const profilePicture = useStoreSelector(selectProfilePicuture);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModalVisibleState = useCallback(
    () => setModalVisible((prevState) => !prevState),
    []
  );

  const navigateTo = useCallback(
    (screen: string) => {
      if (
        screen === "CreateContent" ||
        screen === "Chat" ||
        screen === "CloseToMe"
      ) {
        navigation.getParent("root-stack-navigator")?.navigate(screen);
      } else {
        navigation.navigate("UtilityStacks", { screen });
      }
    },
    [navigation]
  );

  const emitEvent = useCallback(
    (screenIndex: number) => {
      const event = navigation.emit({
        type: "tabPress",
        target: routes[screenIndex].key,
        canPreventDefault: true,
      });

      if (
        routes[index].name !== routes[screenIndex].name &&
        !event.defaultPrevented
      ) {
        navigation.navigate(routes[screenIndex]);
      }
    },
    [navigation, index, routes]
  );

  return (
    <View
      style={[
        globalStyles.flexRow,
        isFullScreenActive
          ? globalStyles.semiTransparentBackgroundColor1
          : theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
        styles.tabBar,
      ]}
    >
      <Pressable
        onPress={() => {
          emitEvent(0);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name={index === 0 ? "home-solid" : "home-outline"}
          foreground={isFullScreenActive ? COLOR_8 : undefined}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(1);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name={index === 1 ? "video-solid" : "video-outline"}
          foreground={isFullScreenActive ? COLOR_8 : undefined}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(2);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name={index === 0 ? "shorts" : "shorts"}
          foreground={isFullScreenActive ? COLOR_8 : undefined}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(3);
        }}
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name={index === 3 ? "notification-solid" : "notification-outline"}
          foreground={isFullScreenActive ? COLOR_8 : undefined}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(4);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
          {
            borderWidth: index === 4 ? StyleSheet.hairlineWidth * 4 : 0,
            borderColor: theme === "light" ? COLOR_7 : COLOR_8,
            borderRadius: SIZE_5 + StyleSheet.hairlineWidth * 4,
          },
        ]}
      >
        <Image
          resizeMode="cover"
          style={{
            width: SIZE_9,
            height: SIZE_9,
            borderRadius: SIZE_5,
          }}
          fadeDuration={0}
          source={profilePicture}
        />
      </Pressable>
      <Pressable
        onPress={toggleModalVisibleState}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name="filter"
          foreground={isFullScreenActive ? COLOR_8 : undefined}
        />
      </Pressable>
      <AppModal
        isVisible={isModalVisible}
        onDismiss={toggleModalVisibleState}
        grids={{
          size: "large",
          list: [
            {
              label: "Close To Me",
              name: "following",
              onPress: () => navigateTo("CloseToMe"),
            },
            {
              label: "Chat",
              name: "message-outline",
              onPress: () => navigateTo("Chat"),
            },
            {
              label: "Create",
              name: "create",
              onPress: () => navigateTo("CreateContent"),
            },
            {
              label: "Settings",
              name: "settings-outline",
              onPress: () => navigateTo("Settings"),
            },
            {
              label: "Saved",
              name: "bookmark-outline",
              onPress: () => navigateTo("Saved"),
            },
            {
              label: "Favourite",
              name: "favourite",
              onPress: () => navigateTo("Favourite"),
            },
          ],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
