import { useCallback } from "react";
import {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function usePopupAnimation() {
  const popupAnimatedValue = useSharedValue(0);

  const startPopupAnimation = useCallback(() => {
    cancelAnimation(popupAnimatedValue);
    popupAnimatedValue.value = 0;
    popupAnimatedValue.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.linear }),
      withDelay(600, withTiming(0, { duration: 300, easing: Easing.linear }))
    );
  }, []);

  const popupAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: popupAnimatedValue.value,
      transform: [
        {
          translateY: interpolate(popupAnimatedValue.value, [0, 1], [0, -150]),
        },
      ],
    };
  });

  return {
    startPopupAnimation,
    popupAnimatedStyle,
    popupAnimatedValue,
  };
}
