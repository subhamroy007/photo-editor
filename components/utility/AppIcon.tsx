import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { AppIconProps } from "../../constants/types";

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../../font.config.json";
import { AppContainer } from "./AppContainer";
import {
  SIZE_10,
  SIZE_11,
  SIZE_12,
  SIZE_13,
  SIZE_5,
} from "../../constants/constants";
export const Icon = createIconSetFromFontello(fontelloConfig, "icons", "icons");

export function AppIcon({
  name,
  size,
  type,
  background,
  foreground,
  bounces,
  onPress,
  styleProp,
  borderSize,
}: AppIconProps) {
  size = size ? size : "medium";
  background = background ? background : "#3f71f2";

  foreground = foreground ? foreground : "white";

  const {
    iconSize,
    heigth,
    width,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
  } = useMemo(() => {
    let iconSize = 0;
    let width: number | undefined = 0;
    let heigth: number | undefined = 0;
    let backgroundColor = "";
    let borderColor = "";
    let borderWidth = 0;
    let borderRadius = 0;

    switch (size) {
      case "small":
        iconSize = SIZE_10;
        width = 3 * SIZE_10;
        heigth = 3 * SIZE_10;
        borderRadius = 1.5 * SIZE_10;
        break;
      case "medium":
        iconSize = SIZE_11;
        width = 2.8 * iconSize;
        heigth = 2.8 * iconSize;
        borderRadius = 1.4 * iconSize;
        break;
      case "large":
        iconSize = SIZE_12;
        width = 2.2 * iconSize;
        heigth = 2.2 * iconSize;
        borderRadius = 1.1 * iconSize;
        break;
      case "extra-small":
        iconSize = SIZE_5;
        width = 2.2 * iconSize;
        heigth = 2.2 * iconSize;
        borderRadius = 1.1 * iconSize;
        break;
      case "extra-large":
        iconSize = SIZE_13;
        width = 3 * iconSize;
        heigth = 3 * iconSize;
        borderRadius = 1.5 * iconSize;
        break;
    }

    switch (type) {
      default:
        backgroundColor = "transparent";
        borderColor = "transparent";
        width = undefined;
        heigth = undefined;
        break;
      case "outline":
        backgroundColor = "transparent";
        borderColor = foreground!;
        break;
      case "solid":
        backgroundColor = background!;
        borderColor = "transparent";
        break;
    }

    switch (borderSize) {
      case "small":
        borderWidth = 2 * StyleSheet.hairlineWidth;
        break;
      case "large":
        borderWidth = 4 * StyleSheet.hairlineWidth;
        break;
      default:
        borderWidth = 0;
    }

    return {
      iconSize,
      width,
      heigth,
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius,
    };
  }, [size, background, foreground, type, borderSize]);

  return (
    <AppContainer
      width={width}
      height={heigth}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      borderWidth={borderWidth}
      borderColor={borderColor}
      styleProp={styleProp}
      onPress={onPress}
      isAnimated={bounces}
    >
      <Icon name={name} color={foreground} size={iconSize} />
    </AppContainer>
  );
}
