import { StyleSheet, Text } from "react-native";
import {
  COLOR_1,
  COLOR_8,
  SIZE_10,
  SIZE_14,
  SIZE_23,
  SIZE_25,
  SIZE_4,
  SIZE_5,
  SIZE_6,
} from "../../constants/constants";
import { AppLabelProps } from "../../constants/types";

export function AppLabel({
  text,
  size,
  style,
  gap,
  corner,
  background,
  foreground,
  styleProp,
  hasUnderline,
  isBackgroundVisible,
  isBorderVisible,
  noOfLines,
  onPress,
}: AppLabelProps) {
  let fontSize = 0;
  let fontFamily = "";
  let padding = 0;
  let borderRadius = 0;
  let backgroundColor = "";
  let borderColor = "";
  let foregroundColor = foreground ? foreground : COLOR_8;

  switch (size) {
    case "medium":
      fontSize = SIZE_10;
      break;
    case "large":
      fontSize = SIZE_23;
      break;
    case "extra-large":
      fontSize = SIZE_14;
      break;
    case "extra-small":
      fontSize = SIZE_5;
      break;
    case "small":
    default:
      fontSize = SIZE_25;
      break;
  }

  switch (style) {
    case "bold":
      fontFamily = "roboto-bold";
      break;
    case "regular":
      fontFamily = "roboto-regular";
      break;
    case "medium":
    default:
      fontFamily = "roboto-medium";
      break;
  }

  switch (gap) {
    case "small":
      padding = SIZE_4;
      break;
    case "large":
      padding = SIZE_5;
      break;
    default:
      padding = 0;
  }

  switch (corner) {
    case "small-round":
      borderRadius = SIZE_4;
      break;
    case "large-round":
      borderRadius = SIZE_6;
      break;
    default:
      borderRadius = 0;
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
    <Text
      onPress={onPress}
      style={[
        {
          fontFamily,
          fontSize,
          lineHeight:
            noOfLines && noOfLines > 1 ? Math.round(fontSize * 1.2) : fontSize,
          textDecorationLine: hasUnderline ? "underline" : "none",
          borderWidth: 2 * StyleSheet.hairlineWidth,
          backgroundColor,
          color: foregroundColor,
          borderColor,
          paddingVertical: padding,
          paddingHorizontal: padding * 2,
          borderRadius: borderRadius,
          textAlignVertical: noOfLines && noOfLines > 1 ? "top" : "center",
          textAlign: noOfLines && noOfLines > 1 ? "left" : "center",
        },
        styleProp,
      ]}
      numberOfLines={noOfLines ? noOfLines : 1}
      ellipsizeMode="tail"
    >
      {text}
    </Text>
  );
}
