import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback } from "react";
import { Easing, StyleProp, Vibration, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type AppPressableProps = {
  children: ReactNode;
  disableTap?: boolean;
  disableLongPress?: boolean;
  onTap?: () => void;
  onLongPress?: () => void;
  vibrateOnLongPress?: boolean;
  overlayColor?: string;
  styleProp?: StyleProp<ViewStyle>;
  animateOnTap?: boolean;
  animateOnLongPress?: boolean;
  animateOnTouch?: boolean;
};

export function AppPressable({
  children,
  disableLongPress,
  disableTap,
  onLongPress,
  onTap,
  vibrateOnLongPress,
  overlayColor,
  styleProp,
  animateOnTap,
  animateOnLongPress,
  animateOnTouch,
}: AppPressableProps) {
  const isPressedIn = useSharedValue(false);
  const isTapped = useSharedValue(false);
  const isLongPressed = useSharedValue(false);

  const toggleIsPressedIn = useCallback(() => {
    isPressedIn.value = !isPressedIn.value;
  }, []);

  const toggleisTapped = useCallback(() => {
    isTapped.value = !isTapped.value;
  }, []);

  const toggleIsLongPressed = useCallback(() => {
    isLongPressed.value = !isLongPressed.value;
  }, []);

  const longPrssHandler = useCallback(() => {
    if (vibrateOnLongPress) {
      Vibration.vibrate(40);
    }
    if (onLongPress) {
      onLongPress();
    }
    toggleIsLongPressed();
  }, [onLongPress, vibrateOnLongPress]);

  const tapHandler = useCallback(() => {
    if (onTap) {
      onTap();
    }
    toggleisTapped();
  }, [onTap]);

  const longPressGesture = Gesture.LongPress()
    .enabled(disableLongPress === undefined ? true : !disableLongPress)
    .onStart(longPrssHandler)
    .shouldCancelWhenOutside(true)
    .minDuration(400);

  const tapGesture = Gesture.Tap()
    .enabled(disableTap === undefined ? true : !disableTap)
    .onStart(tapHandler)
    .shouldCancelWhenOutside(true)
    .onTouchesDown(toggleIsPressedIn)
    .onTouchesCancelled(toggleIsPressedIn)
    .onTouchesUp(toggleIsPressedIn)
    .maxDuration(disableLongPress === true ? 100000 : 400);

  const compoundGesture = Gesture.Exclusive(tapGesture, longPressGesture);

  const { onLayout, width, height } = useLayout();

  const overlatStyle = useAnimatedStyle(() => {
    return {
      zIndex: isPressedIn.value ? 10 : -10,
      opacity: isPressedIn.value ? 0.4 : 0,
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            animateOnTap && isTapped.value
              ? withSequence(
                  withTiming(0.8, { duration: 200 }),
                  withTiming(1, { duration: 200 }, () => {
                    runOnJS(toggleisTapped)();
                  })
                )
              : animateOnLongPress && isLongPressed.value
              ? withSequence(
                  withTiming(0.8, { duration: 200 }),
                  withTiming(1, { duration: 200 }, () => {
                    runOnJS(toggleIsLongPressed)();
                  })
                )
              : animateOnTouch
              ? withTiming(isPressedIn.value ? 0.8 : 1, { duration: 200 })
              : 1,
        },
      ],
    };
  }, [
    toggleisTapped,
    toggleIsLongPressed,
    animateOnTap,
    animateOnTouch,
    animateOnLongPress,
  ]);

  return (
    <GestureDetector gesture={compoundGesture}>
      <Animated.View style={[styleProp, containerStyle]} onLayout={onLayout}>
        {children}
        {overlayColor && (
          <Animated.View
            style={[
              styleProp,
              {
                backgroundColor: overlayColor,
                width,
                height,
                position: "absolute",
              },
              overlatStyle,
            ]}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}
