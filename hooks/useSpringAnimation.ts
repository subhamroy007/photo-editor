import { useCallback, useMemo, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { SPRING_ANIMATION_DURAION_MS } from "../constants/constants";

export function useSpringAnimation() {
  const springAnimationValue = useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;

  const startSpringAnimation = useCallback(() => {
    springAnimationValue.stopAnimation();
    springAnimationValue.setValue(0);
    Animated.sequence([
      Animated.timing(springAnimationValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: SPRING_ANIMATION_DURAION_MS,
      }),
      Animated.timing(springAnimationValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: SPRING_ANIMATION_DURAION_MS,
      }),
    ]).start();
  }, []);

  const springAnimationStyle = useMemo<
    Animated.WithAnimatedObject<ViewStyle>
  >(() => {
    return {
      transform: [
        {
          scale: springAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.7],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  }, []);

  return {
    springAnimationStyle,
    springAnimationValue,
    startSpringAnimation,
  };
}
