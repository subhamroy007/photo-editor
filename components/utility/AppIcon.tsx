import { StyleSheet } from "react-native";
import { AppIconProps } from "../../constants/types";

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../../font.config.json";
import {
  COLOR_1,
  COLOR_8,
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
  let borderColor = "";
  let foregroundColor = foreground ? foreground : COLOR_8;

  switch (size) {
    case "small":
      iconSize = SIZE_10;
      break;
    case "large":
      iconSize = SIZE_12;
      break;
    case "extra-small":
      iconSize = SIZE_5;
      break;
    case "extra-large":
      iconSize = SIZE_13;
      break;
    case "medium":
    default:
      iconSize = SIZE_9;
      break;
  }

  switch (gap) {
    case "small":
      containerSize = Math.round(iconSize * 2.5);
      break;
    case "large":
      containerSize = Math.round(iconSize * 3);
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

  if (isBorderVisible) {
    borderColor = foreground ? foreground : COLOR_8;
  } else {
    borderColor = "transparent";
  }

  return (
    <Icon
      name={name}
      size={iconSize}
      onPress={onPress}
      style={[
        styleProp,
        {
          borderWidth: 2 * StyleSheet.hairlineWidth,
          backgroundColor: backgroundColor,
          color: foregroundColor,
          borderColor: borderColor,
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
