import { useEffect } from "react";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import {
  COLOR_1,
  COLOR_5,
  SIZE_1,
  SIZE_12,
  SIZE_17,
  SIZE_20,
  SIZE_21,
  SIZE_22,
  SIZE_27,
} from "../../constants/constants";
import { ImageParams } from "../../constants/types";
import { AppContainer } from "./AppContainer";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AppAvatarProps = {
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
  hasRing?: boolean;
  type?: "animated" | "inactive" | "active";
  styleProp?: StyleProp<ViewStyle>;
  uri: string;
};

export function AppAvatar({
  size,
  uri,
  hasRing,
  type,
  styleProp,
}: AppAvatarProps) {
  const arcAnimatedValue = useSharedValue(0);

  const svgAnimatedValue = useSharedValue(0);

  type = type ? type : "active";
  size = size ? size : "small";

  useEffect(() => {
    if (type === "animated") {
      arcAnimatedValue.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );

      svgAnimatedValue.value = withRepeat(
        withTiming(1, { duration: 5000, easing: Easing.in(Easing.linear) }),
        -1,
        false
      );
    } else {
      cancelAnimation(arcAnimatedValue);
      cancelAnimation(svgAnimatedValue);
      arcAnimatedValue.value = 0;
      svgAnimatedValue.value = 0;
    }
  }, [type]);

  let avatarSize = 0;
  let strokeSize = 0;
  let circumference = 0;
  let noOfSections = 24;

  switch (size) {
    case "extra-small":
      avatarSize = SIZE_12;
      strokeSize = 2 * StyleSheet.hairlineWidth;
      break;

    case "small":
      avatarSize = SIZE_27;
      strokeSize = 3 * StyleSheet.hairlineWidth;
      break;

    case "medium":
      avatarSize = SIZE_20;
      strokeSize = 4 * StyleSheet.hairlineWidth;
      break;

    case "large":
      avatarSize = SIZE_17;
      strokeSize = 5 * StyleSheet.hairlineWidth;
      break;

    case "extra-large":
      avatarSize = SIZE_1;
      strokeSize = 6 * StyleSheet.hairlineWidth;
      break;
  }

  circumference = Math.PI * (avatarSize - strokeSize);

  const firstCircleAnimatedProps = useAnimatedProps(() => {
    const redChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [63, 255, 188, 78, 63]
    );

    const greenChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [113, 78, 78, 255, 113]
    );

    const blueChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [242, 216, 255, 95, 242]
    );

    return {
      stroke: `rgb(${redChannel}, ${greenChannel}, ${blueChannel})`,
      strokeDashoffset:
        interpolate(
          arcAnimatedValue.value,
          [0, 1],
          [(noOfSections - 1) / noOfSections, 1]
        ) * circumference,
    };
  }, [noOfSections, circumference]);

  const secondCircleAnimatedProps = useAnimatedProps(() => {
    const redChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [63, 255, 188, 78, 63]
    );

    const greenChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [113, 78, 78, 255, 113]
    );

    const blueChannel = interpolate(
      svgAnimatedValue.value,
      [0, 0.25, 0.5, 0.75, 1.0],
      [242, 216, 255, 95, 242]
    );

    return {
      stroke: `rgb(${redChannel}, ${greenChannel}, ${blueChannel})`,
      strokeDashoffset:
        interpolate(
          arcAnimatedValue.value,
          [0, 1],
          [1, (noOfSections - 1) / noOfSections]
        ) * circumference,
    };
  }, [noOfSections, circumference]);

  const svgAnimatedProps = useAnimatedProps(() => {
    return {
      rotation: interpolate(svgAnimatedValue.value, [0, 1], [0, 360]),
    };
  });

  const sections = [];
  for (let i = 0; i < noOfSections / 2; i++) {
    sections.push((i * 720) / noOfSections);
  }
  return (
    <AppContainer
      styleProp={styleProp}
      width={avatarSize}
      height={avatarSize}
      minorAxisAlignment="center"
      majorAxisAlignment="center"
      borderRadius={avatarSize / 2}
    >
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={{
          width: avatarSize - 4 * strokeSize,
          height: avatarSize - 4 * strokeSize,
          borderRadius: (avatarSize - 4 * strokeSize) / 2,
          backgroundColor: COLOR_5,
        }}
        fadeDuration={0}
      />
      {hasRing && (
        <AnimatedSvg
          width={avatarSize}
          height={avatarSize}
          animatedProps={svgAnimatedProps}
          style={{ position: "absolute", borderRadius: avatarSize / 2 }}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {type === "animated" ? (
            sections.map((section) => (
              <G
                originX={avatarSize / 2}
                originY={avatarSize / 2}
                rotation={section}
                key={section}
              >
                <AnimatedCircle
                  cx={avatarSize / 2}
                  cy={avatarSize / 2}
                  r={(avatarSize - strokeSize) / 2}
                  strokeWidth={strokeSize}
                  strokeDasharray={circumference}
                  originX={avatarSize / 2}
                  originY={avatarSize / 2}
                  animatedProps={firstCircleAnimatedProps}
                />
                <AnimatedCircle
                  cx={avatarSize / 2}
                  cy={avatarSize / 2}
                  r={(avatarSize - strokeSize) / 2}
                  strokeWidth={strokeSize}
                  strokeDasharray={circumference}
                  originX={avatarSize / 2}
                  originY={avatarSize / 2}
                  rotation={360 / noOfSections}
                  animatedProps={secondCircleAnimatedProps}
                />
              </G>
            ))
          ) : (
            <Circle
              cx={avatarSize / 2}
              cy={avatarSize / 2}
              r={(avatarSize - strokeSize) / 2}
              strokeWidth={strokeSize}
              strokeDasharray={circumference}
              originX={avatarSize / 2}
              originY={avatarSize / 2}
              stroke={type === "active" ? COLOR_1 : COLOR_5}
            />
          )}
        </AnimatedSvg>
      )}
    </AppContainer>
  );
}
