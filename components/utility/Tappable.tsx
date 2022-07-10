import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { globalStyles } from "../../constants/style";

export type TappableProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onTapIn?: () => void;
  onTapOut?: () => void;
  onTap?: () => void;
  disabled?: boolean;
  type?: "underlay" | "overlay" | "animated";
};

export function Tappable({
  children,
  style,
  onTap,
  onTapIn,
  onTapOut,
  disabled,
  type,
}: TappableProps) {
  const [isTappedIn, setTappedIn] = useState(false);

  const tapBeginHandler = useCallback(() => {
    if (onTapIn) {
      onTapIn();
    }
    setTappedIn(true);
  }, [onTapIn]);

  const tapHandler = useCallback(() => {
    if (onTap) {
      onTap();
    }
  }, [onTap]);

  const tapEndHandler = useCallback(() => {
    if (onTapOut) {
      onTapOut();
    }
    setTappedIn(false);
  }, [onTapOut]);

  const tapGesture = Gesture.Tap()
    .maxDuration(10000000)
    .enabled(disabled === true ? false : true)
    .onBegin(tapBeginHandler)
    .onStart(tapHandler)
    .onEnd(tapEndHandler)
    .onTouchesCancelled(tapEndHandler)
    .shouldCancelWhenOutside(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            type === "animated"
              ? withTiming(isTappedIn ? 0.84 : 1, { duration: 300 })
              : 1,
        },
      ],
    };
  }, [type, isTappedIn]);

  const { height, onLayout, width } = useLayout();

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle, style]} onLayout={onLayout}>
        {type === "underlay" && isTappedIn && (
          <View
            style={[
              style,
              { width, height },
              globalStyles.absolutePosition,
              globalStyles.secondaryLightBackgroundColor,
            ]}
          />
        )}
        {children}
        {type === "overlay" && isTappedIn && (
          <View
            style={[
              style,
              { width, height, opacity: 0.3 },
              globalStyles.absolutePosition,
              globalStyles.primaryLightBackgroundColor,
            ]}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}
