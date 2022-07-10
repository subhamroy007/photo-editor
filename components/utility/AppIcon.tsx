import { StyleSheet } from "react-native";
import { AppIconProps } from "../../constants/types";

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../../font.config.json";
import {
  COLOR_1,
  COLOR_7,
  COLOR_8,
  SIZE_10,
  SIZE_12,
  SIZE_13,
  SIZE_14,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../constants/constants";
const Icon = createIconSetFromFontello(fontelloConfig, "icons", "icons");

export function AppIcon({
  name,
  size,
  background,
  foreground,
  styleProp,
  isBackgroundVisible,
  isBorderVisible,
  onPress,
  gap,
}: AppIconProps) {
  let iconSize = 0;
  let containerSize = 0;
  let backgroundColor = "";
  let foregroundColor = foreground
    ? foreground
    : isBackgroundVisible
    ? COLOR_8
    : COLOR_7;

  switch (size) {
    case "small":
      iconSize = SIZE_6;
      break;
    case "large":
      iconSize = SIZE_14;
      break;
    case "extra-small":
      iconSize = SIZE_5;
      break;
    case "extra-large":
      iconSize = SIZE_12;
      break;
    case "medium":
    default:
      iconSize = SIZE_9;
      break;
  }

  switch (gap) {
    case "small":
      containerSize = Math.round(iconSize * 2);
      break;
    case "large":
      containerSize = Math.round(iconSize * 3);
      break;
    case "medium":
      containerSize = Math.round(iconSize * 2.5);
      break;
    case "none":
    default:
      containerSize = iconSize;
      break;
  }

  if (isBackgroundVisible) {
    backgroundColor = background ? background : COLOR_1;
  } else {
    backgroundColor = "transparent";
  }

  return (
    <Icon
      name={name}
      size={iconSize}
      onPress={onPress}
      style={[
        styleProp,
        {
          borderWidth: isBorderVisible
            ? 2 * StyleSheet.hairlineWidth
            : undefined,
          backgroundColor: backgroundColor,
          color: foregroundColor,
          borderColor: isBorderVisible ? foregroundColor : undefined,
          borderRadius:
            isBackgroundVisible || isBorderVisible ? containerSize / 2 : 0,
          width:
            isBackgroundVisible || isBorderVisible ? containerSize : iconSize,
          height:
            isBackgroundVisible || isBorderVisible ? containerSize : iconSize,
          padding:
            isBackgroundVisible || isBorderVisible
              ? (containerSize - iconSize) / 2
              : 0,
        },
      ]}
    />
  );
}
