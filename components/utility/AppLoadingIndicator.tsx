import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Easing } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_19,
  COLOR_5,
  SIZE_1,
  SIZE_15,
  SIZE_17,
  SIZE_20,
  SIZE_21,
  SIZE_22,
} from "../../constants/constants";
import { useStoreSelector } from "../../hooks/useStoreSelector";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AppLoadingIndicatorProps = {
  style?: StyleProp<ViewStyle>;
};

export function AppLoadingIndicator({ style }: AppLoadingIndicatorProps) {
  const theme = useStoreSelector(selectAppTheme);

  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  let color = "";

  if (theme === "light") {
    color = COLOR_5;
  } else {
    color = COLOR_19;
  }

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.linear,
        isInteraction: false,
      })
    ).start();
  }, []);

  let indicatorSize = SIZE_21;
  let strokeSize = 4 * StyleSheet.hairlineWidth;
  let circumference = Math.PI * indicatorSize;

  circumference = Math.PI * (indicatorSize - strokeSize);

  return (
    <AnimatedSvg
      width={indicatorSize}
      height={indicatorSize}
      strokeWidth={strokeSize}
      style={[
        {
          borderRadius: indicatorSize / 2,
          transform: [
            {
              rotateZ: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0 + "deg", 360 + "deg"],
                extrapolate: "clamp",
              }),
            },
          ],
        },
        style,
      ]}
      stroke={color}
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
