import { useEffect } from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
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
import {
  COLOR_1,
  COLOR_5,
  SIZE_1,
  SIZE_12,
  SIZE_14,
  SIZE_20,
  SIZE_21,
  SIZE_34,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type AppAvatarProps = {
  size?:
    | "small"
    | "medium"
    | "large"
    | "extra-large"
    | "extra-small"
    | "tiny"
    | "big";
  hasRing?: boolean;
  isActive?: boolean;
  isAnimated?: boolean;
  styleProp?: StyleProp<ViewStyle>;
  uri: string;
};

export function AppAvatar({
  size,
  uri,
  hasRing,
  isActive,
  isAnimated,
  styleProp,
}: AppAvatarProps) {
  const animatedValue = useSharedValue(0);

  const circleAnimatedValue = useSharedValue(0);

  useEffect(() => {
    if (isAnimated && hasRing) {
      animatedValue.value = 0;
      circleAnimatedValue.value = 0;
      animatedValue.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.cubic),
        }),
        -1,
        false
      );
      circleAnimatedValue.value = withRepeat(
        withTiming(1, {
          duration: 750,
          easing: Easing.inOut(Easing.linear),
        }),
        -1,
        true
      );
    }

    return () => {
      if (isAnimated && hasRing) {
        cancelAnimation(animatedValue);
        cancelAnimation(circleAnimatedValue);
        animatedValue.value = 0;
        circleAnimatedValue.value = 0;
      }
    };
  }, [isAnimated, hasRing]);

  let avatarSize = 0;
  let strokeWidth = 0;
  let circumference = 0;
  let noOfSection = 8;
  let protion = 0.5;
  let section = 0;

  switch (size) {
    case "tiny":
      avatarSize = SIZE_6;
      strokeWidth = 0;
      break;
    case "extra-small":
      avatarSize = SIZE_14;
      strokeWidth = 0;
      break;
    case "small":
    default:
      avatarSize = SIZE_12;
      strokeWidth = 3 * StyleSheet.hairlineWidth;
      break;
    case "medium":
      avatarSize = SIZE_21;
      strokeWidth = 3 * StyleSheet.hairlineWidth;
      break;
    case "large":
      avatarSize = SIZE_20;
      strokeWidth = 4 * StyleSheet.hairlineWidth;
      break;
    case "extra-large":
      avatarSize = SIZE_34;
      strokeWidth = 4 * StyleSheet.hairlineWidth;
      break;
    case "big":
      avatarSize = SIZE_1;
      strokeWidth = 5 * StyleSheet.hairlineWidth;
      break;
  }

  circumference = Math.PI * (avatarSize - strokeWidth);
  section = Math.floor((circumference * protion) / (noOfSection * 2));

  const sectionRotations = [];

  for (let i = 0; i < noOfSection; i++) {
    sectionRotations.push(Math.floor((360 * protion) / noOfSection) * i);
  }

  const animatedSvgStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(
              animatedValue.value,
              [0, 1],
              [0, 360],
              Extrapolate.CLAMP
            ) + "deg",
        },
      ],
    };
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(
        circleAnimatedValue.value,
        [0, 1],
        [0, circumference]
      ),
    };
  });

  return (
    <View
      style={[
        styleProp,
        { width: avatarSize, height: avatarSize },
        globalStyles.alignCenter,
        globalStyles.justifyCenter,
      ]}
    >
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={{
          width: avatarSize - 4 * strokeWidth,
          height: avatarSize - 4 * strokeWidth,
          borderRadius: (avatarSize - 4 * strokeWidth) / 2,
          backgroundColor: COLOR_5,
        }}
        fadeDuration={0}
      />
      {hasRing && (
        <>
          <AnimatedSvg
            width={avatarSize}
            height={avatarSize}
            style={[animatedSvgStyle, globalStyles.absolutePosition]}
          >
            {sectionRotations.map((angel) => (
              <Circle
                key={angel}
                stroke={isActive ? COLOR_1 : COLOR_5}
                strokeWidth={strokeWidth}
                cx={avatarSize / 2}
                cy={avatarSize / 2}
                originX={avatarSize / 2}
                originY={avatarSize / 2}
                r={(avatarSize - strokeWidth) / 2}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - section}
                rotation={angel - 90}
              />
            ))}
          </AnimatedSvg>
          <Svg
            width={avatarSize}
            height={avatarSize}
            style={[
              globalStyles.absolutePosition,
              { transform: [{ rotateY: "180deg" }] },
            ]}
          >
            <AnimatedCircle
              stroke={isActive ? COLOR_1 : COLOR_5}
              strokeWidth={strokeWidth}
              cx={avatarSize / 2}
              cy={avatarSize / 2}
              originX={avatarSize / 2}
              originY={avatarSize / 2}
              r={(avatarSize - strokeWidth) / 2}
              strokeDasharray={circumference}
              animatedProps={animatedCircleProps}
              rotation={-90}
            />
          </Svg>
        </>
      )}
    </View>
  );
}
