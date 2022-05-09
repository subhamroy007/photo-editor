import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { SCREEN_WIDTH } from "../constants/constants";

const INDICATOR_SIZE = Math.round(SCREEN_WIDTH / 9);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type LoadingIndicatorProps = {
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
  color?: string;
};

export function LoadingIndicator({
  size,
  style,
  color,
}: LoadingIndicatorProps) {
  const progress = useSharedValue(0);

  size = size ? size : "large";

  color = color ? color : "white";

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const strokeWidth = size === "small" ? 1 : 2;

  const radius = size === "small" ? INDICATOR_SIZE / 4 : INDICATOR_SIZE / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate:
          interpolate(progress.value, [0, 1], [0, 360], Extrapolate.CLAMP) +
          "deg",
      },
    ],
  }));

  const animatedCircleProps = useAnimatedProps(
    () => ({
      strokeDashoffset: interpolate(
        progress.value,
        [0, 1],
        [2 * Math.PI * (radius - strokeWidth), 0],
        Extrapolate.CLAMP
      ),
    }),
    [radius, strokeWidth]
  );

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Svg width={radius * 2} height={radius * 2}>
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          originX={radius}
          originY={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={2 * Math.PI * (radius - strokeWidth)}
          rotation={270}
          animatedProps={animatedCircleProps}
        />
      </Svg>
    </Animated.View>
  );
}
