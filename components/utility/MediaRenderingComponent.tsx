import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_11,
  COLOR_8,
  DOUBLE_TAP_POPUP_ANIMATION_DELAY,
  DOUBLE_TAP_POPUP_ANIMATION_END_DURATION,
  DOUBLE_TAP_POPUP_ANIMATION_VALUE_START,
  DOUBLE_TAP_POPUP_ANIMATION_VELOCITY,
  POSTER_BLUR_RADIUS,
  POSTER_FADE_DURATION_MS,
  SIZE_17,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { MediaRenderingComponentProps } from "../../constants/types";
import { AppGestureComponent } from "./AppGestureComponent";
import { AppIcon } from "./AppIcon";
import { AppPressable } from "./AppPressable";

export function MediaRenderingComponent(props: MediaRenderingComponentProps) {
  const {
    loadAsync,
    onError,
    onLoad,
    poster,
    onDoubleTap,
    type,
    children,
    disabled,
    height,
    width,
    style,
    ...gestureProps
  } = props;

  const [state, setState] = useState<"ready" | "error" | "loading">("loading");

  const doubleTapAnimatedValue = useSharedValue(0);

  useEffect(() => {
    const loadHanlder = async () => {
      if (state === "loading") {
        try {
          await loadAsync();
          setState("ready");
          onLoad();
        } catch (error) {
          setState("error");
          onError();
        }
      }
    };

    loadHanlder();
  }, [state]);

  const resetLoadingState = useCallback(() => {
    setState("loading");
  }, []);

  const doubleTapHandler = useCallback(() => {
    onDoubleTap();
    cancelAnimation(doubleTapAnimatedValue);
    doubleTapAnimatedValue.value = DOUBLE_TAP_POPUP_ANIMATION_VALUE_START;
    doubleTapAnimatedValue.value = withSequence(
      withSpring(1, { velocity: DOUBLE_TAP_POPUP_ANIMATION_VELOCITY }),
      withDelay(
        DOUBLE_TAP_POPUP_ANIMATION_DELAY,
        withTiming(0, { duration: DOUBLE_TAP_POPUP_ANIMATION_END_DURATION })
      )
    );
  }, [onDoubleTap]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: doubleTapAnimatedValue.value }],
      opacity: doubleTapAnimatedValue.value,
    };
  });

  const gestureStatus = disabled === true || state !== "ready";

  return (
    <AppGestureComponent
      {...gestureProps}
      onDoubleTap={doubleTapHandler}
      disabled={gestureStatus}
      style={[style, { width, height }]}
    >
      {children}
      {!gestureStatus && (
        <Animated.View
          style={[globalStyles.absolutePosition, animatedIconStyle]}
        >
          <AppIcon
            name={type === "post" ? "heart-solid" : "following"}
            isBackgroundVisible
            size="large"
            background={COLOR_11}
          />
        </Animated.View>
      )}
      {!(state === "ready") && (
        <>
          <Animated.Image
            resizeMode="cover"
            style={[globalStyles.absolutePosition, styles.poster]}
            source={{ uri: poster }}
            blurRadius={POSTER_BLUR_RADIUS}
            fadeDuration={0}
            exiting={FadeOut.duration(POSTER_FADE_DURATION_MS)}
          />
          {state === "loading" ? (
            <View
              style={[globalStyles.absolutePosition, styles.loadingCirle]}
            />
          ) : (
            <AppPressable
              styleProp={globalStyles.absolutePosition}
              hitslop={SIZE_6}
              onPress={resetLoadingState}
            >
              <AppIcon name="undo" size="large" isBorderVisible />
            </AppPressable>
          )}
        </>
      )}
    </AppGestureComponent>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: "100%",
    height: "100%",
  },
  loadingCirle: {
    width: SIZE_17,
    height: SIZE_17,
    borderRadius: Math.round(SIZE_17 / 2),
    borderColor: COLOR_8,
    borderWidth: 2 * StyleSheet.hairlineWidth,
  },
});
