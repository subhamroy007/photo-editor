import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import {
  COLOR_6,
  SIZE_1,
  SIZE_17,
  SIZE_20,
  SIZE_21,
  SIZE_22,
} from "../../constants/constants";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AppLoadingIndicatorProps = {
  color?: string;
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
};

export function AppLoadingIndicator({ color, size }: AppLoadingIndicatorProps) {
  color = color ? color : COLOR_6;
  size = size ? size : "medium";

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  let indicatorSize = 0;
  let strokeSize = 0;
  let circumference = 0;

  switch (size) {
    case "extra-small":
      indicatorSize = SIZE_22;
      strokeSize = 2 * StyleSheet.hairlineWidth;
      break;

    case "small":
      indicatorSize = SIZE_21;
      strokeSize = 3 * StyleSheet.hairlineWidth;
      break;

    case "medium":
      indicatorSize = SIZE_20;
      strokeSize = 4 * StyleSheet.hairlineWidth;
      break;

    case "large":
      indicatorSize = SIZE_17;
      strokeSize = 5 * StyleSheet.hairlineWidth;
      break;

    case "extra-large":
      indicatorSize = SIZE_1;
      strokeSize = 6 * StyleSheet.hairlineWidth;
      break;
  }

  circumference = Math.PI * (indicatorSize - strokeSize);

  const animatedProps = useAnimatedProps(() => {
    return {
      rotation: interpolate(animatedValue.value, [0, 1], [0, 360]),
    };
  });

  return (
    <AnimatedSvg
      width={indicatorSize}
      height={indicatorSize}
      strokeWidth={strokeSize}
      style={{ borderRadius: indicatorSize / 2 }}
      stroke={color}
      animatedProps={animatedProps}
    >
      <Circle
        cx={indicatorSize / 2}
        cy={indicatorSize / 2}
        r={(indicatorSize - strokeSize) / 2}
        strokeDasharray={circumference}
        strokeOpacity={0.4}
      />
      <Circle
        cx={indicatorSize / 2}
        cy={indicatorSize / 2}
        r={(indicatorSize - strokeSize) / 2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.8}
      />
    </AnimatedSvg>
  );
}
