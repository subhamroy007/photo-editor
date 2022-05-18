import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  SIZE_1,
  SIZE_10,
  SIZE_11,
  SIZE_12,
  SIZE_17,
  SIZE_20,
  SIZE_21,
  SIZE_22,
} from "../../constants/constants";
import { ImageParams } from "../../constants/types";
import { AppContainer } from "./AppContainer";

export type AppAvatarProps = {
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
  hasRing?: boolean;
  type?: "animated" | "inactive" | "active";
  styleProp?: StyleProp<ViewStyle>;
  image: ImageParams;
};

export function AppAvatar({
  size,
  image,
  hasRing,
  type,
  styleProp,
}: AppAvatarProps) {
  type = type ? type : "active";
  size = size ? size : "small";

  let avatarSize = 0;
  let ringSize = 0;

  switch (size) {
    case "extra-small":
      avatarSize = SIZE_22;
      ringSize = 2 * StyleSheet.hairlineWidth;
      break;

    case "small":
      avatarSize = SIZE_21;
      ringSize = 3 * StyleSheet.hairlineWidth;
      break;

    case "medium":
      avatarSize = SIZE_20;
      ringSize = 4 * StyleSheet.hairlineWidth;
      break;

    case "large":
      avatarSize = SIZE_17;
      ringSize = 5 * StyleSheet.hairlineWidth;
      break;

    case "extra-large":
      avatarSize = SIZE_1;
      ringSize = 6 * StyleSheet.hairlineWidth;
      break;
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
        source={{ ...image }}
        resizeMode="cover"
        style={{
          width: avatarSize - 4 * ringSize,
          height: avatarSize - 4 * ringSize,
          borderRadius: (avatarSize - 4 * ringSize) / 2,
          backgroundColor: "#e1e1e1",
        }}
        fadeDuration={0}
      />
      {hasRing && (
        <Svg
          width={avatarSize}
          height={avatarSize}
          style={{ borderRadius: avatarSize / 2, position: "absolute" }}
        >
          <Circle
            cx={avatarSize / 2}
            cy={avatarSize / 2}
            r={avatarSize / 2 - ringSize / 2}
            strokeWidth={ringSize}
            stroke={type === "active" ? "white" : "grey"}
            originX={avatarSize / 2}
            originY={avatarSize / 2}
          />
        </Svg>
      )}
    </AppContainer>
  );
}
