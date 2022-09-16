import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Insets,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  DOUBLE_TAP_DURATION_MS,
  LONG_PRESS_DURATION_MS,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppPressableProps = {
  disabled?: boolean;
  onPress?: () => void;
  onPressOut?: () => void;
  onPressIn?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  hitSlop?: number | Insets;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  type?: "overlay" | "underlay" | "animated";
  animatedStyle?: Animated.WithAnimatedObject<ViewStyle>;
  transparent?: boolean;
};

export function AppPressable({
  disabled,
  hitSlop,
  onDoubleTap,
  onLongPress,
  onPress,
  onPressIn,
  onPressOut,
  children,
  style,
  type,
  animatedStyle,
  transparent,
}: AppPressableProps) {
  const theme = useStoreSelector(selectAppTheme);

  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const [isPressedIn, setPressedIn] = useState(false);

  const { height, width, onLayout } = useLayout();

  useEffect(() => {
    if (
      isPressedIn &&
      type === "animated" &&
      onDoubleTap === undefined &&
      onLongPress === undefined
    ) {
      animatedValue.stopAnimation();
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: LONG_PRESS_DURATION_MS,
      }).start();
    }

    return () => {
      if (
        isPressedIn &&
        type === "animated" &&
        onDoubleTap === undefined &&
        onLongPress === undefined
      ) {
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
          duration: LONG_PRESS_DURATION_MS,
        }).start();
      }
    };
  }, [type, isPressedIn, onLongPress, onDoubleTap]);

  return (
    <AnimatedPressable
      android_disableSound
      onLayout={onLayout}
      disabled={disabled}
      onLongPress={onLongPress}
      onPressIn={() => {
        if (onDoubleTap === undefined && onLongPress === undefined) {
          setPressedIn(true);
        }
        if (onPressIn) {
          onPressIn();
        }
      }}
      onPressOut={() => {
        if (onDoubleTap === undefined && onLongPress === undefined) {
          setPressedIn(false);
        }
        if (onPressOut) {
          onPressOut();
        }
      }}
      onPress={() => {
        if (onDoubleTap) {
          if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current);
            timeoutId.current = null;
            onDoubleTap();
          } else {
            timeoutId.current = setTimeout(() => {
              if (onPress) {
                onPress();
              }
              timeoutId.current = null;
            }, DOUBLE_TAP_DURATION_MS);
          }
        } else if (onPress) {
          onPress();
        }
      }}
      delayLongPress={LONG_PRESS_DURATION_MS}
      style={[
        style,
        {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.85],
                extrapolate: "clamp",
              }),
            },
          ],
        },
        animatedStyle,
      ]}
      hitSlop={hitSlop}
    >
      {type === "underlay" && isPressedIn && (
        <View
          style={[
            style,
            {
              width,
              height,
            },
            theme === "dark" || transparent
              ? globalStyles.secondaryDarkBackgroundColor
              : globalStyles.secondaryLightBackgroundColor,
            globalStyles.absolutePosition,
          ]}
        />
      )}
      {children}
      {type === "overlay" && isPressedIn && (
        <View
          style={[
            style,
            { width, height, opacity: 0.3 },
            globalStyles.absolutePosition,
            globalStyles.primaryLightBackgroundColor,
          ]}
        />
      )}
    </AnimatedPressable>
  );
}
