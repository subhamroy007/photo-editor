import { useCallback } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function useDoubleTapPopupGesture(
  onDoubleTap: () => void,
  isEnabled: boolean
) {
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedValue.value }],
      opacity: animatedValue.value,
    };
  });

  const doubleTapHandler = useCallback(() => {
    cancelAnimation(animatedValue);
    animatedValue.value = 0.5;
    animatedValue.value = withSequence(
      withSpring(1, { velocity: 5 }),
      withDelay(800, withTiming(0, { duration: 200 }))
    );
    onDoubleTap();
  }, [onDoubleTap]);

  const doubleTapGesture = Gesture.Tap()
    .enabled(isEnabled)
    .onStart(doubleTapHandler)
    .numberOfTaps(2)
    .maxDuration(400);

  return {
    doubleTapGesture,
    animatedStyle,
  };
}
