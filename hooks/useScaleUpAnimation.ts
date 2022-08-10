import { useCallback, useMemo, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import {
  DOUBLE_TAP_POPUP_ANIMATION_DELAY,
  DOUBLE_TAP_POPUP_ANIMATION_END_DURATION,
  DOUBLE_TAP_POPUP_ANIMATION_VELOCITY,
} from "../constants/constants";

export function useScaleUpAnimation() {
  const scaleUpAnimationValue = useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;

  const startScaleUpAnimation = useCallback(() => {
    scaleUpAnimationValue.stopAnimation();
    scaleUpAnimationValue.setValue(0);
    Animated.sequence([
      Animated.spring(scaleUpAnimationValue, {
        toValue: 1,
        useNativeDriver: true,
        velocity: DOUBLE_TAP_POPUP_ANIMATION_VELOCITY,
      }),
      Animated.timing(scaleUpAnimationValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: DOUBLE_TAP_POPUP_ANIMATION_END_DURATION,
        delay: DOUBLE_TAP_POPUP_ANIMATION_DELAY,
      }),
    ]).start();
  }, []);

  const scaleUpAnimationStyle = useMemo<
    Animated.WithAnimatedObject<ViewStyle>
  >(() => {
    return {
      transform: [
        {
          scale: scaleUpAnimationValue,
        },
      ],
      opacity: scaleUpAnimationValue,
    };
  }, []);

  return {
    scaleUpAnimationValue,
    startScaleUpAnimation,
    scaleUpAnimationStyle,
  };
}
