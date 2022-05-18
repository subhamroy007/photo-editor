import { useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Rect } from "react-native-svg";
import { SIZE_17 } from "../../constants/constants";
import { AppContainer } from "../utility/AppContainer";

const size = SIZE_17;
const width = 5 * StyleSheet.hairlineWidth;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type RecordButtonProps = {
  isRecording?: boolean;
  styleProp?: StyleProp<ViewStyle>;
  percentageComplete?: SharedValue<number>;
};

export function RecordButton({
  isRecording,
  styleProp,
  percentageComplete,
}: RecordButtonProps) {
  const strokeWidthAnimatedValue = useSharedValue(0);
  const strokeColorAnimatedValue = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      strokeWidthAnimatedValue.value = withRepeat(
        withTiming(1, { duration: 500, easing: Easing.linear }),
        -1,
        true
      );
      strokeColorAnimatedValue.value = withRepeat(
        withTiming(1, { duration: 5000, easing: Easing.linear }),
        -1,
        true
      );
    } else {
      cancelAnimation(strokeColorAnimatedValue);
      cancelAnimation(strokeWidthAnimatedValue);
      strokeColorAnimatedValue.value = 0;
      strokeWidthAnimatedValue.value = 0;
    }
  }, [isRecording]);

  const animatedProps = useAnimatedProps(() => {
    const redChannel = isRecording
      ? interpolate(
          strokeColorAnimatedValue.value,
          [0, 0.5, 1],
          [120, 30, 240],
          Extrapolate.CLAMP
        )
      : 255;
    const greenChannel = isRecording
      ? interpolate(
          strokeColorAnimatedValue.value,
          [0, 0.5, 1],
          [78, 210, 56],
          Extrapolate.CLAMP
        )
      : 255;
    const blueChannel = isRecording
      ? interpolate(
          strokeColorAnimatedValue.value,
          [0, 0.5, 1],
          [178, 10, 156],
          Extrapolate.CLAMP
        )
      : 255;

    return {
      strokeWidth: interpolate(
        strokeWidthAnimatedValue.value,
        [0, 1],
        [width, width * 1.6],
        Extrapolate.CLAMP
      ),
      stroke: `rgb(${redChannel}, ${greenChannel}, ${blueChannel})`,
    };
  }, [isRecording]);

  const animatedSecondSvgProps = useAnimatedProps(() => {
    return {
      scaleX: withTiming(isRecording ? 0.8 : 1, {
        duration: 200,
        easing: Easing.linear,
      }),
      scaleY: withTiming(isRecording ? 0.8 : 1, {
        duration: 200,
        easing: Easing.linear,
      }),
    };
  }, [isRecording]);

  const animatedSvgProps = useAnimatedProps(() => {
    return {
      scaleX: withTiming(isRecording ? 1.4 : 1, {
        duration: 200,
        easing: Easing.linear,
      }),
      scaleY: withTiming(isRecording ? 1.4 : 1, {
        duration: 200,
        easing: Easing.linear,
      }),
    };
  }, [isRecording]);

  const animatedSecondCircleProps = useAnimatedProps(() => {
    return {
      strokeWidth: interpolate(
        strokeWidthAnimatedValue.value,
        [0, 1],
        [width, width * 1.6],
        Extrapolate.CLAMP
      ),
      strokeDashoffset: percentageComplete
        ? interpolate(
            percentageComplete.value,
            [0, 1],
            [
              0,
              2 *
                Math.PI *
                (size / 2 - (isRecording ? width * 0.8 : width * 0.5)),
            ],
            Extrapolation.CLAMP
          )
        : 2 * Math.PI * (size / 2 - (isRecording ? width * 0.8 : width * 0.5)),
    };
  }, [percentageComplete]);

  return (
    <AppContainer
      styleProp={styleProp}
      width={size}
      height={size}
      borderRadius={size / 2}
      majorAxisAlignment="center"
      minorAxisAlignment="center"
    >
      <AnimatedSvg
        width={size}
        height={size}
        animatedProps={animatedSvgProps}
        style={{ borderRadius: size / 2 }}
      >
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - (isRecording ? width * 0.8 : width * 0.5)}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - (isRecording ? width * 0.8 : width * 0.5)}
          stroke="white"
          strokeDasharray={
            2 * Math.PI * (size / 2 - (isRecording ? width * 0.8 : width * 0.5))
          }
          animatedProps={animatedSecondCircleProps}
          opacity={isRecording ? 1 : 0}
          originX={size / 2}
          originY={size / 2}
          rotation={-90}
        />
      </AnimatedSvg>

      <AnimatedSvg
        width={size}
        height={size}
        style={{ borderRadius: size / 2, position: "absolute" }}
        animatedProps={animatedSecondSvgProps}
        opacity={isRecording ? 1 : 0}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2 * width}
          fill="white"
        />
        <Rect
          width={size / 3}
          height={size / 3}
          fill="violet"
          x={size / 2 - size / 6}
          y={size / 2 - size / 6}
        />
      </AnimatedSvg>
    </AppContainer>
  );
}
