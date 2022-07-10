import { useCallback } from "react";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  DOUBLE_TAP_POPUP_ANIMATION_DELAY,
  DOUBLE_TAP_POPUP_ANIMATION_END_DURATION,
  DOUBLE_TAP_POPUP_ANIMATION_VELOCITY,
} from "../constants/constants";

export function useScaleUpAnimation() {
  const scaleUpAnimatedValue = useSharedValue(0);

  const startScaleUpAnimation = useCallback(() => {
    cancelAnimation(scaleUpAnimatedValue);
    scaleUpAnimatedValue.value = 0;
    scaleUpAnimatedValue.value = withSequence(
      withSpring(1, { velocity: DOUBLE_TAP_POPUP_ANIMATION_VELOCITY }),
      withDelay(
        DOUBLE_TAP_POPUP_ANIMATION_DELAY,
        withTiming(0, { duration: DOUBLE_TAP_POPUP_ANIMATION_END_DURATION })
      )
    );
  }, []);

  const scaleUpAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleUpAnimatedValue.value }],
      opacity: scaleUpAnimatedValue.value,
    };
  });

  return {
    scaleUpAnimatedValue,
    startScaleUpAnimation,
    scaleUpAnimationStyle,
  };
}
