import { useKeyboard } from "@react-native-community/hooks";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet } from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  MODAL_ANIMATION_DURATION_MS,
  SIZE_5,
  SIZE_6,
  TAB_BAR_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Icon } from "./Icon";

export function Shutter(props: BottomTabBarProps) {
  const {
    state: { index, routes },
    navigation,
  } = props;

  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  let isFullScreenActive = false;
  if (index === 1) {
    isFullScreenActive = true;
  }

  const isBottomTabBarHidden = false;

  const theme = useStoreSelector(selectAppTheme);

  const navigateTo = useCallback(
    (screen: string) => {
      navigation.navigate(screen);
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

  const { keyboardShown } = useKeyboard();

  useEffect(() => {
    switchPostion(!(keyboardShown || isBottomTabBarHidden));
  }, [keyboardShown, isBottomTabBarHidden]);

  const switchPostion = useCallback((visible: boolean) => {
    Animated.timing(animatedValue, {
      toValue: visible ? 0 : 1,
      useNativeDriver: true,
      duration: MODAL_ANIMATION_DURATION_MS,
      easing: Easing.linear,
      isInteraction: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        isFullScreenActive ? globalStyles.absolutePosition : undefined,
        globalStyles.flexRow,
        globalStyles.justifyAround,
        globalStyles.alignCenter,
        isFullScreenActive
          ? globalStyles.semiTransparentBackgroundColor
          : theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
        isFullScreenActive ? undefined : globalStyles.primaryTopBorderWidth,
        isFullScreenActive || theme === "dark"
          ? globalStyles.primaryDarkBorderColor
          : globalStyles.primaryLightBorderColor,
        styles.tabBar,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, TAB_BAR_HEIGHT],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => {
          emitEvent(0);
        }}
        hitSlop={{ bottom: SIZE_5, top: SIZE_5, left: SIZE_6, right: SIZE_6 }}
        android_disableSound
      >
        <Icon
          name={index === 0 ? "home-solid" : "home-outline"}
          transparent={isFullScreenActive}
        />
      </Pressable>
      <Pressable
        hitSlop={{ bottom: SIZE_5, top: SIZE_5, left: SIZE_6, right: SIZE_6 }}
        onPress={() => {
          emitEvent(1);
        }}
        android_disableSound
      >
        <Icon
          name={index === 1 ? "heart-solid" : "heart-outline"}
          transparent={isFullScreenActive}
        />
      </Pressable>

      <Pressable
        android_disableSound
        hitSlop={{ bottom: SIZE_5, top: SIZE_5, left: SIZE_6, right: SIZE_6 }}
      >
        <Icon name="create" transparent={isFullScreenActive} />
      </Pressable>
      <Pressable
        hitSlop={{ bottom: SIZE_5, top: SIZE_5, left: SIZE_6, right: SIZE_6 }}
        onPress={() => {
          emitEvent(3);
        }}
      >
        <Icon
          name={index === 3 ? "search-solid" : "search-regular"}
          transparent={isFullScreenActive}
        />
      </Pressable>
      <Pressable
        hitSlop={{ bottom: SIZE_5, top: SIZE_5, left: SIZE_6, right: SIZE_6 }}
        onPress={() => {}}
      >
        <Icon name={"comment"} transparent={isFullScreenActive} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
