import { useCallback, useMemo, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { FADE_ANIMATION_DURATION_MS } from "../constants/constants";

export function useFadeAnimation(initValue: boolean) {
  const fadeAnimationValue = useRef<Animated.Value>(
    new Animated.Value(initValue ? 1 : 0)
  ).current;

  const startFadeAnimation = useCallback((value: boolean) => {
    fadeAnimationValue.stopAnimation();
    Animated.timing(fadeAnimationValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      duration: FADE_ANIMATION_DURATION_MS,
    }).start();
  }, []);

  const fadeAnimationStyle = useMemo<
    Animated.WithAnimatedObject<ViewStyle>
  >(() => {
    return {
      opacity: fadeAnimationValue,
    };
  }, []);

  return {
    fadeAnimationStyle,
    fadeAnimationValue,
    startFadeAnimation,
  };
}
