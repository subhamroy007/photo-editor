import { ReactNode, useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { globalStyles } from "../../constants/style";

export type AppPressableProps = {
  children?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  styleProp?: StyleProp<ViewStyle>;
  hitslop?: number;
};

export function AppPressable({
  children,
  hitslop,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  styleProp,
}: AppPressableProps) {
  const tapHandler = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const tapStartHandler = useCallback(() => {
    if (onPressIn) {
      onPressIn();
    }
  }, [onPressIn]);

  const tapEndHandler = useCallback(() => {
    if (onPressOut) {
      onPressOut();
    }
  }, [onPressOut]);

  const tapGesture = Gesture.Tap()
    .enabled(disabled === undefined ? true : !disabled)
    .hitSlop({ bottom: hitslop, left: hitslop, right: hitslop, top: hitslop })
    .onStart(tapHandler)
    .onEnd(tapEndHandler)
    .onBegin(tapStartHandler);

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          globalStyles.alignCenter,
          globalStyles.justifyCenter,
          styleProp,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
