import { useMemo } from "react";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { SIZE_1, SIZE_10, SIZE_11, SIZE_12 } from "../../constants/constants";
import { AppContainer } from "./AppContainer";

export type AppAvatarProps = {
  uri: string;
  size?: "small" | "medium" | "large" | "extra-large";
  width: number;
  height: number;
  hasRing?: boolean;
  type?: "animated" | "inactive" | "active";
  bounce?: boolean;
  onPress?: () => void;
  styleProp?: StyleProp<ViewStyle>;
};

export function AppAvatar({
  size,
  uri,
  height,
  width,
  hasRing,
  type,
  bounce,
  onPress,
  styleProp,
}: AppAvatarProps) {
  type = type ? type : "active";
  size = size ? size : "small";

  const { avatarSize, ringSize } = useMemo(() => {
    let avatarSize = 0;
    let ringSize = 0;

    switch (size) {
      case "small":
        avatarSize = SIZE_10 * 3;
        ringSize = 3 * StyleSheet.hairlineWidth;
        break;

      case "medium":
        avatarSize = SIZE_11 * 2.8;
        ringSize = 4 * StyleSheet.hairlineWidth;
        break;

      case "large":
        avatarSize = SIZE_12 * 2.2;
        ringSize = 5 * StyleSheet.hairlineWidth;
        break;

      case "extra-large":
        avatarSize = SIZE_1;
        ringSize = 6 * StyleSheet.hairlineWidth;
        break;
    }

    return { avatarSize, ringSize };
  }, [size]);

  return (
    <AppContainer
      styleProp={styleProp}
      isAnimated={bounce}
      onPress={onPress}
      width={avatarSize}
      height={avatarSize}
      minorAxisAlignment="center"
      majorAxisAlignment="center"
      borderRadius={avatarSize / 2}
    >
      <Image
        source={{ uri, width, height }}
        resizeMode="cover"
        style={{
          width: avatarSize - 4 * ringSize,
          height: avatarSize - 4 * ringSize,
          borderRadius: (avatarSize - 4 * ringSize) / 2,
          backgroundColor: "grey",
        }}
      />
      {hasRing && (
        <Svg
          width={avatarSize}
          height={avatarSize}
          style={[styles.svg, { borderRadius: avatarSize / 2 }]}
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

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
  },
});
