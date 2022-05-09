import { useLayout } from "@react-native-community/hooks";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppPressableProps } from "../../constants/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppPressable({
  children,
  isAnimated,
  onPress,
  styleProp,
  activeOverlayColor,
  disabled,
}: AppPressableProps) {
  const isPressed = useSharedValue(false);

  const { height, width, onLayout } = useLayout();

  const onPressed = useCallback(() => {
    isPressed.value = false;

    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const onPressIn = useCallback(() => {
    isPressed.value = true;
  }, []);

  const onPressOut = useCallback(() => {
    isPressed.value = false;
  }, []);

  const animatedContentContainerStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: isAnimated
            ? withTiming(isPressed.value ? 0.8 : 1, { duration: 200 })
            : 1,
        },
      ],
    }),
    [isAnimated]
  );

  const animatedOverlayStyle = useAnimatedStyle(
    () => ({
      backgroundColor: activeOverlayColor,
      zIndex: isPressed.value ? 5 : -5,
      opacity: isPressed.value ? 0.4 : 0,
      width,
      height,
    }),
    [activeOverlayColor, width, height]
  );

  return (
    <AnimatedPressable
      onPress={onPressed}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.contentContainer,
        styleProp,
        animatedContentContainerStyle,
      ]}
      disabled={disabled}
      onLayout={onLayout}
    >
      {children}
      {activeOverlayColor && (
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
});
