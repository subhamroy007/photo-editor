import { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { COLOR_8, SIZE_26, SIZE_7 } from "../../constants/constants";
import { globalStyles } from "../../constants/style";

export type SoundTrackAnimationProps = {
  styleProp?: StyleProp<ViewStyle>;
  size?: "small" | "large";
};

export function SoundTrackAnimation({
  size,
  styleProp,
}: SoundTrackAnimationProps) {
  size = size ? size : "small";
  let barSize = 0;
  switch (size) {
    case "small":
      barSize = SIZE_7;
      break;
    case "large":
      barSize = SIZE_26;
      break;
  }

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 500, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  const sideBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: interpolate(animatedValue.value, [0, 1], [0.5, 0.9]) },
      ],
    };
  });

  const middleBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: interpolate(animatedValue.value, [0, 1], [0.9, 0.5]) },
      ],
    };
  });

  return (
    <View
      style={[
        styleProp,
        { width: 5 * barSize, height: 5 * barSize },
        globalStyles.flexRow,
        globalStyles.justifyBetween,
      ]}
    >
      <Animated.View
        style={[
          {
            borderRadius: barSize,
            backgroundColor: COLOR_8,
            width: barSize,
            height: 5 * barSize,
          },
          sideBarAnimatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            borderRadius: barSize,
            backgroundColor: COLOR_8,
            width: barSize,
            height: 5 * barSize,
          },
          middleBarAnimatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            borderRadius: barSize,
            backgroundColor: COLOR_8,
            width: barSize,
            height: 5 * barSize,
          },
          sideBarAnimatedStyle,
        ]}
      />
    </View>
  );
}
