import { StyleSheet } from "react-native";
import { AppIconProps } from "../../constants/types";

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../../font.config.json";
import { AppContainer } from "./AppContainer";
import {
  SIZE_1,
  SIZE_10,
  SIZE_11,
  SIZE_12,
  SIZE_13,
  SIZE_17,
  SIZE_20,
  SIZE_21,
  SIZE_22,
  SIZE_5,
} from "../../constants/constants";
export const Icon = createIconSetFromFontello(fontelloConfig, "icons", "icons");

export function AppIcon({
  name,
  size,
  type,
  background,
  foreground,
  styleProp,
  borderSize,
}: AppIconProps) {
  size = size ? size : "medium";
  background = background ? background : "#3f71f2";

  foreground = foreground ? foreground : "white";

  let iconSize = 0;
  let width: number | undefined;
  let heigth: number | undefined;
  let backgroundColor = "";
  let borderColor = "";
  let borderWidth = 0;
  let borderRadius = 0;

  switch (size) {
    case "small":
      iconSize = SIZE_10;
      width = SIZE_21;
      heigth = SIZE_21;
      borderRadius = SIZE_21 / 2;
      break;
    case "medium":
      iconSize = SIZE_11;
      width = SIZE_20;
      heigth = SIZE_20;
      borderRadius = SIZE_20 / 2;
      break;
    case "large":
      iconSize = SIZE_12;
      width = SIZE_17;
      heigth = SIZE_17;
      borderRadius = SIZE_17 / 2;
      break;
    case "extra-small":
      iconSize = SIZE_5;
      width = SIZE_22;
      heigth = SIZE_22;
      borderRadius = SIZE_22 / 2;
      break;
    case "extra-large":
      iconSize = SIZE_13;
      width = SIZE_1;
      heigth = SIZE_1;
      borderRadius = SIZE_1 / 2;
      break;
  }

  switch (type) {
    case "outline":
      backgroundColor = "transparent";
      borderColor = foreground!;
      break;
    case "solid":
      backgroundColor = background!;
      borderColor = "transparent";
      break;
    default:
      backgroundColor = "transparent";
      borderColor = "transparent";
      width = undefined;
      heigth = undefined;
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

  return (
    <AppContainer
      width={width}
      height={heigth}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      borderWidth={borderWidth}
      borderColor={borderColor}
      styleProp={styleProp}
    >
      <Icon name={name} color={foreground} size={iconSize} />
    </AppContainer>
  );
}
