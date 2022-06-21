import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_5,
  COLOR_6,
  COLOR_7,
  COLOR_8,
  COLOR_9,
  SCREEN_WIDTH,
  SHUTTER_BODY_HEIGHT,
  SHUTTER_DRAG_ANIMATION_DURATION_MS,
  SHUTTER_HEADER_HEIGHT,
  SHUTTER_TOTAL_HEIGHT,
  SIZE_12,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import useAppSafeAreaInsets from "../../hooks/useAppSafeAreaInsets";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";
import { AppPressable } from "./AppPressable";

export function Shutter(props: BottomTabBarProps) {
  const {
    state: { index, routeNames, routes },
    navigation,
  } = props;

  const currentFocusedScreen = routeNames[index];

  const { left, right } = useAppSafeAreaInsets();

  const homeIconPressHandler = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: routes[0].key,
      canPreventDefault: true,
    });

    if (currentFocusedScreen !== "HomeFeed" && !event.defaultPrevented) {
      navigation.navigate("HomeFeed");
    }
    moveShutter("close");
  }, [navigation, currentFocusedScreen, routes]);

  const videoIconPressHandler = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: routes[1].key,
      canPreventDefault: true,
    });

    if (currentFocusedScreen !== "VideoFeed" && !event.defaultPrevented) {
      navigation.navigate("VideoFeed");
    }
    moveShutter("close");
  }, [navigation, currentFocusedScreen, routes]);

  const shortsIconPressHandler = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: routes[2].key,
      canPreventDefault: true,
    });

    if (currentFocusedScreen !== "ShortsFeed" && !event.defaultPrevented) {
      navigation.navigate("ShortsFeed");
    }
    moveShutter("close");
  }, [navigation, currentFocusedScreen, routes]);

  const notificationIconPressHandler = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: routes[3].key,
      canPreventDefault: true,
    });

    if (currentFocusedScreen !== "Notification" && !event.defaultPrevented) {
      navigation.navigate("Notification");
    }
    moveShutter("close");
  }, [navigation, currentFocusedScreen, routes]);

  const accountIconPressHandler = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: routes[4].key,
      canPreventDefault: true,
    });

    if (currentFocusedScreen !== "Account" && !event.defaultPrevented) {
      navigation.navigate("Account");
    }
    moveShutter("close");
  }, [navigation, currentFocusedScreen, routes]);

  const moveShutter = useCallback((direction: "open" | "close") => {
    if (direction === "open") {
      dragValue.value = withTiming(
        -SHUTTER_BODY_HEIGHT,
        {
          duration: SHUTTER_DRAG_ANIMATION_DURATION_MS,
          easing: Easing.linear,
        },
        () => {
          dragOffset.value = -SHUTTER_BODY_HEIGHT;
        }
      );
    } else {
      dragValue.value = withTiming(
        0,
        {
          duration: SHUTTER_DRAG_ANIMATION_DURATION_MS,
          easing: Easing.linear,
        },
        () => {
          dragOffset.value = 0;
        }
      );
    }
  }, []);

  const onOverlayPress = useCallback(() => {
    moveShutter("close");
  }, []);

  const dragOffset = useSharedValue(0);
  const dragValue = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .onUpdate(({ translationY }) => {
      dragValue.value = Math.max(
        -SHUTTER_BODY_HEIGHT,
        Math.min(0, dragOffset.value + translationY)
      );
    })
    .onEnd(() => {
      if (dragValue.value < 0 && dragValue.value > -SHUTTER_BODY_HEIGHT / 2) {
        runOnJS(moveShutter)("close");
      } else {
        runOnJS(moveShutter)("open");
      }
    });

  const animatedShutterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: dragValue.value }],
      borderTopEndRadius: interpolate(
        dragValue.value,
        [0, -SHUTTER_BODY_HEIGHT],
        [0, SIZE_5]
      ),
      borderTopStartRadius: interpolate(
        dragValue.value,
        [0, -SHUTTER_BODY_HEIGHT],
        [0, SIZE_5]
      ),
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(dragValue.value, [0, -SHUTTER_BODY_HEIGHT], [0, 1]),
    };
  });

  const bodyIconStyle: ViewStyle = {
    marginLeft: (SCREEN_WIDTH - 3 * Math.round(SIZE_9 * 3) - left - right) / 4,
    marginTop:
      (SHUTTER_BODY_HEIGHT -
        SHUTTER_HEADER_HEIGHT -
        2 * Math.round(SIZE_9 * 3)) /
      3,
  };

  const trendingIconPressHandler = useCallback(() => {
    console.log("going to trending screen");
    //TODO
    //navigato to trending screen
    moveShutter("close");
  }, [navigation]);

  const historyIconPressHandler = useCallback(() => {
    console.log("going to history screen");
    //TODO
    //navigato to history screen
    moveShutter("close");
  }, [navigation]);

  const settingsIconPressHandler = useCallback(() => {
    console.log("going to settings screen");
    //TODO
    //navigato to settings screen
    moveShutter("close");
  }, [navigation]);

  const bookmarkIconPressHandler = useCallback(() => {
    console.log("going to saved screen");
    //TODO
    //navigato to history screen
    moveShutter("close");
  }, [navigation]);

  const chatIconPressHandler = useCallback(() => {
    console.log("going to chat screen");
    //TODO
    //navigato to chat screen
    moveShutter("close");
  }, [navigation]);

  const webIconPressHandler = useCallback(() => {
    console.log("going to web screen");
    //TODO
    //navigato to web screen
    moveShutter("close");
  }, [navigation]);

  const createIconPressHandler = useCallback(() => {
    console.log("going to create screen");
    //TODO
    //navigato to create screen
    moveShutter("close");
  }, [navigation]);

  return (
    <>
      <AppPressable
        styleProp={[
          StyleSheet.absoluteFill,
          animatedOverlayStyle,
          globalStyles.semitransparentBackgroundColor,
        ]}
        onPress={onOverlayPress}
      />

      <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[
            animatedShutterStyle,
            globalStyles.absolutePosition,
            styles.shutter,
          ]}
        >
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.justifyAround,
              globalStyles.alignCenter,
              styles.shutterHeader,
            ]}
          >
            <Pressable
              onPress={homeIconPressHandler}
              android_disableSound
              hitSlop={SIZE_9}
            >
              <AppIcon
                name={
                  currentFocusedScreen === "HomeFeed"
                    ? "home-solid"
                    : "home-outline"
                }
                foreground="black"
              />
            </Pressable>
            <Pressable
              onPress={videoIconPressHandler}
              android_disableSound
              hitSlop={SIZE_9}
            >
              <AppIcon
                name={
                  currentFocusedScreen === "VideoFeed"
                    ? "video-solid"
                    : "video-outline"
                }
                foreground="black"
              />
            </Pressable>
            <Pressable
              onPress={shortsIconPressHandler}
              android_disableSound
              hitSlop={SIZE_9}
            >
              <AppIcon
                name={
                  currentFocusedScreen === "ShortsFeed" ? "shorts" : "shorts"
                }
                foreground="black"
              />
            </Pressable>
            <Pressable
              onPress={notificationIconPressHandler}
              android_disableSound
              hitSlop={SIZE_9}
            >
              <AppIcon
                name={
                  currentFocusedScreen === "Notification"
                    ? "notification-solid"
                    : "notification-outline"
                }
                foreground="black"
              />
            </Pressable>
            <Pressable
              onPress={accountIconPressHandler}
              android_disableSound
              hitSlop={SIZE_9}
            >
              <AppIcon
                name={
                  currentFocusedScreen === "Account"
                    ? "user-solid"
                    : "user-outline"
                }
                foreground="black"
              />
            </Pressable>
          </View>
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignStart,
              styles.shutterBody,
            ]}
          >
            <Pressable
              style={bodyIconStyle}
              hitSlop={SIZE_9}
              android_disableSound
              onPress={settingsIconPressHandler}
            >
              <AppIcon
                name="settings-outline"
                gap="large"
                isBackgroundVisible
                foreground={COLOR_7}
                background={COLOR_5}
              />
            </Pressable>

            <Pressable
              style={bodyIconStyle}
              hitSlop={SIZE_9}
              android_disableSound
              onPress={bookmarkIconPressHandler}
            >
              <AppIcon
                name="bookmark-outline"
                gap="large"
                isBackgroundVisible
                foreground={COLOR_7}
                background={COLOR_5}
              />
            </Pressable>
            <Pressable
              style={bodyIconStyle}
              hitSlop={SIZE_9}
              android_disableSound
              onPress={chatIconPressHandler}
            >
              <AppIcon
                name="send"
                gap="large"
                isBackgroundVisible
                foreground={COLOR_7}
                background={COLOR_5}
              />
            </Pressable>
            <Pressable
              style={bodyIconStyle}
              hitSlop={SIZE_9}
              android_disableSound
              onPress={webIconPressHandler}
            >
              <AppIcon
                name="message-outline"
                gap="large"
                isBackgroundVisible
                foreground={COLOR_7}
                background={COLOR_5}
              />
            </Pressable>
            <Pressable
              style={bodyIconStyle}
              hitSlop={SIZE_9}
              android_disableSound
              onPress={createIconPressHandler}
            >
              <AppIcon
                name="create"
                gap="large"
                isBackgroundVisible
                foreground={COLOR_7}
                background={COLOR_5}
              />
            </Pressable>
          </View>
          {currentFocusedScreen === "VideoFeed" && (
            <View
              style={[
                globalStyles.flexRow,
                globalStyles.flex1,
                globalStyles.alignCenter,
                globalStyles.justifyEven,
              ]}
            >
              <Pressable
                style={[globalStyles.alignCenter, globalStyles.justifyCenter]}
                hitSlop={SIZE_9}
                android_disableSound
                onPress={trendingIconPressHandler}
              >
                <AppIcon name="trending-outline" foreground={COLOR_7} />
                <AppLabel
                  size="extra-small"
                  text="trending"
                  foreground={COLOR_7}
                  styleProp={styles.topMarginExtraSmall}
                />
              </Pressable>

              <Pressable
                style={[globalStyles.alignCenter, globalStyles.justifyCenter]}
                hitSlop={SIZE_9}
                android_disableSound
                onPress={historyIconPressHandler}
              >
                <AppIcon name="history" foreground={COLOR_7} />
                <AppLabel
                  size="extra-small"
                  text="history"
                  foreground={COLOR_7}
                  styleProp={styles.topMarginExtraSmall}
                />
              </Pressable>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  shutter: {
    width: "100%",
    height: SHUTTER_TOTAL_HEIGHT,
    backgroundColor: COLOR_8,
    bottom: -SHUTTER_BODY_HEIGHT,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR_6,
  },
  shutterHeader: {
    height: SHUTTER_HEADER_HEIGHT,
  },
  shutterBody: {
    height: SHUTTER_BODY_HEIGHT - SHUTTER_HEADER_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR_6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexWrap: "wrap",
  },
  topMarginExtraSmall: {
    marginTop: 4 * StyleSheet.hairlineWidth,
  },
});
