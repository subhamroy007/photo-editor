import { PixelRatio, StyleSheet, View } from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_1,
  COLOR_12,
  COLOR_13,
  COLOR_19,
  COLOR_5,
  COLOR_7,
  COLOR_8,
  SIZE_10,
  SIZE_14,
  SIZE_23,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { RoundIconProps } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Icon } from "./Icon";

export function RoundIcon({
  name,
  alignment,
  background,
  foreground,
  gap,
  size,
  style,
  styleProp,
  transparent,
  type,
}: RoundIconProps) {
  const theme = useStoreSelector(selectAppTheme);

  let iconSize = 0;
  let containerSize = 0;
  let backgroundColor = "";
  let foregroundColor = "";

  if (style === "solid") {
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
        style === "solid" || transparent || theme === "dark"
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
      iconSize = SIZE_10;
      break;
    case "large":
      iconSize = SIZE_9;
      break;
    case "extra-small":
      iconSize = SIZE_5;
      break;
    case "extra-large":
      iconSize = SIZE_14;
      break;
    case "medium":
    default:
      iconSize = SIZE_23;
      break;
  }

  switch (gap) {
    case "small":
      containerSize = PixelRatio.roundToNearestPixel(iconSize * 2);
      break;
    case "large":
      containerSize = PixelRatio.roundToNearestPixel(iconSize * 3);
      break;
    case "medium":
    default:
      containerSize = PixelRatio.roundToNearestPixel(iconSize * 2.5);
      break;
  }

  return (
    <View
      style={[
        styleProp,
        globalStyles.justifyCenter,
        {
          borderWidth:
            !style || style === "outline" ? 2 * StyleSheet.hairlineWidth : 0,
          backgroundColor: backgroundColor,
          borderColor: foregroundColor,
          borderRadius: containerSize / 2,
          width: containerSize,
          height: containerSize,
        },
        !alignment || alignment === "center"
          ? globalStyles.alignSelfCenter
          : alignment === "start"
          ? globalStyles.alignSelfStart
          : globalStyles.alignSelfEnd,
      ]}
    >
      <Icon
        name={name}
        foreground={foreground}
        size={size}
        transparent={transparent}
      />
    </View>
  );
}
