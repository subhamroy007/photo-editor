import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { globalStyles } from "../../constants/style";
import { AppGestureComponentProps } from "../../constants/types";

export function AppGestureComponent({
  disabled,
  onDoubleTap,
  onLongPress,
  onTap,
  style,
  children,
}: AppGestureComponentProps) {
  const tapGesture = Gesture.Tap()
    .enabled(disabled === undefined ? true : !disabled)
    .onStart(onTap)
    .maxDuration(400);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(disabled === undefined ? true : !disabled)
    .onStart(onDoubleTap);

  const longPressGesture = Gesture.LongPress()
    .enabled(disabled === undefined ? true : !disabled)
    .onStart(onLongPress)
    .minDuration(400);

  const compositeGesture = Gesture.Exclusive(
    doubleTapGesture,
    tapGesture,
    longPressGesture
  );

  return (
    <GestureDetector gesture={compositeGesture}>
      <Animated.View
        style={[globalStyles.alignCenter, globalStyles.justifyCenter, style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
