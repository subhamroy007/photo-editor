import { StyleSheet } from "react-native";
import { AppIconProps } from "../../constants/types";

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../../font.config.json";
import {
  COLOR_1,
  COLOR_12,
  COLOR_13,
  COLOR_19,
  COLOR_5,
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
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { selectAppTheme } from "../../api/global/appSelector";
const Icon = createIconSetFromFontello(fontelloConfig, "icons", "icons");

export function AppIcon({
  name,
  size,
  background,
  foreground,
  styleProp,
  backgroundVisible,
  borderVisible,
  onPress,
  gap,
  transparent,
  type,
}: AppIconProps) {
  const theme = useStoreSelector(selectAppTheme);

  let iconSize = 0;
  let containerSize = 0;
  let backgroundColor = "";
  let foregroundColor = "";

  if (backgroundVisible) {
    if (background) {
      backgroundColor = background;
    } else {
      if (!type || type === "primary") {
        backgroundColor = COLOR_1;
      } else if (type === "secondary") {
        backgroundColor = theme === "dark" || transparent ? COLOR_12 : COLOR_13;
      } else {
        backgroundColor = theme === "dark" || transparent ? COLOR_5 : COLOR_19;
      }
    }
  } else {
    backgroundColor = "transparent";
  }

  if (foreground) {
    foregroundColor = foreground;
  } else {
    if (!type || type === "primary") {
      foregroundColor =
        backgroundVisible || transparent || theme === "dark"
          ? COLOR_8
          : COLOR_7;
    } else if (type === "secondary") {
      foregroundColor = transparent || theme === "dark" ? COLOR_13 : COLOR_12;
    } else {
      foregroundColor = transparent || theme === "dark" ? COLOR_19 : COLOR_5;
    }
  }

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

  return (
    <Icon
      name={name}
      size={iconSize}
      onPress={onPress}
      style={[
        styleProp,
        {
          borderWidth: borderVisible ? 2 * StyleSheet.hairlineWidth : undefined,
          backgroundColor: backgroundColor,
          color: foregroundColor,
          borderColor: foregroundColor,
          borderRadius:
            backgroundVisible || borderVisible ? containerSize / 2 : 0,
          width: backgroundVisible || borderVisible ? containerSize : iconSize,
          height: backgroundVisible || borderVisible ? containerSize : iconSize,
          padding:
            backgroundVisible || borderVisible
              ? (containerSize - iconSize) / 2
              : 0,
        },
      ]}
    />
  );
}
